<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from 'vue';
import { fetchy } from "../../utils/fetchy";


// the purpose of this is to just create a graphic UI
// for the spotlight
// this also deals with adding friends with others
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["topic", "isCurrentUser"]);
const empty_context = ref("No Content Yet :(");
const username = props.topic.title.replace("Spotlight: ", "");


async function sendRequest() {
  // this deals with the logic of adding friends given the current context of 
  // we will send a friend request
  try {
    await fetchy(`/api/friend/requests/${username}`, "POST");
  } catch(_) {
    return;
  }
}
</script>


<template>
    <p class="author roboto-font">{{ props.topic.title }} </p>
    <p class="description "> {{ props.topic.content === "" ? empty_context : props.topic.content }} </p>
    <Button @click="sendRequest" v-if="currentUsername !== props.topic.title.replace('Spotlight: ', '')">
      Send Friend Request
    </Button>
    <Button v-else>
      Can't add yourself :(
    </Button>
    <Divider />

</template>

<style scoped>
.author {
  font-weight: bold;
  font-size: 1.2em;
}
.description {
  white-space: pre-wrap;
}
</style>