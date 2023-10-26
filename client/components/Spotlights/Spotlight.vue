<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from 'vue';
import { fetchy } from "../../utils/fetchy";


// the purpose of this is to just create a graphic UI
// for the spotlight
// this also deals with adding friends with others
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["topic", "isCurrentUser", "requests", "friends"]);
const empty_context = ref("No Content Yet :(");
const username = props.topic.title.replace("Spotlight: ", "");
const status = ref('pending');
const fromMe = ref(false);
const toMe = ref(false);
const areFriends = ref(false);

async function sendRequest() {
  // this deals with the logic of adding friends given the current context of 
  // we will send a friend request
  try {
    await fetchy(`/api/friend/requests/${username}`, "POST");
  } catch(_) {
    return;
  }
  fromMe.value = true;
  status.value = "pending";
}
const spotlightUsername = props.topic.title.replace("Spotlight: ", "");

async function setButtons() {
  // this is the logic to check for friends
  props.friends.forEach((friend: Record<string, string>) => {
      console.log(props.friends);
      if (spotlightUsername === friend) {
        areFriends.value = true;
      }
    })
  // we only care about spotlights not equal to the current username
  if (spotlightUsername !== currentUsername.value) {
    console.log(props.requests);
    const requests = props.requests;
    // in this case, we don't even have a connection
    if (requests === undefined) {
      fromMe.value = false;
      toMe.value = false;
      return;
    }
    requests.forEach((request: Record<string, string>) => {
      const from = request.from;
      const to = request.to;
      status.value = request.status;
      if (from === currentUsername.value) {
        fromMe.value = true
      }
      if (to === currentUsername.value) {
        toMe.value = true;
      }
    });


  }
}


onBeforeMount(async () => {
  await setButtons();
  console.log(areFriends.value);
});

</script>


<template>
    <p class="author roboto-font">{{ props.topic.title }} </p>
    <p class="description "> {{ props.topic.content === "" ? empty_context : props.topic.content }} </p>
    <Button v-if="currentUsername === props.topic.title.replace('Spotlight: ', '')">
      Can't add your self :(
    </Button>
    <Button v-else-if="areFriends">
      Friends
    </Button>
    <Button v-else-if="!fromMe && !toMe" @click="sendRequest">
      Send Friend Request
    </Button>
    <Button v-else-if="fromMe && status === 'pending'">
      Friend Request Already Sent
    </Button>
    <Button v-else-if="status === 'rejected'">
      Rejected by user
    </Button>

    <Button v-else-if="toMe && status === 'pending'">
      They send a friend request
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