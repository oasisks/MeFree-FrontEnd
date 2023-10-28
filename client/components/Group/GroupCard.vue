<script setup lang="ts">

// import { ref } from "vue";

const props = defineProps(["group"]);
const emit = defineEmits(["showChat"]);

</script>


<template>
    <Card>
        <template #title>
            {{ props.group.title }}
        </template>
        <template #content>
            <Button @click="$emit('showChat', props.group)" label="Click here to access group" style="background-color: #449DD1;">
                
            </Button>
        </template>
    </Card>

</template>

<style scoped>

</style>