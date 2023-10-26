<script setup lang="ts">
import { ref } from 'vue';


// the purpose of this is to just create a graphic UI
// for the spotlight

const props = defineProps(["topic"]);
const empty_context = ref("No Content Yet :(");

</script>


<template>
    <p class="author roboto-font">{{ props.topic.title }} </p>
    <p class="description "> {{ props.topic.content === "" ? empty_context : props.topic.content }} </p>
</template>

<style scoped>
.author {
  font-weight: bold;
  font-size: 1.2em;

}
</style>