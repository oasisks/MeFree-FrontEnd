<script setup lang="ts">

// the purpose of this is to just create a graphic UI
// for the spotlight

const props = defineProps(["topic"]);

</script>


<template>
    <p class="author roboto-font">{{ props.topic.title }} </p>
    <p class="description "> {{ props.topic.content }} TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest</p>

</template>

<style scoped>
.author {
  font-weight: bold;
  font-size: 1.2em;

}
</style>