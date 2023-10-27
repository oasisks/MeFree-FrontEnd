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
            <Button @click="$emit('showChat', props.group)">
                Click here to access group
            </Button>
        </template>
    </Card>

</template>

<style scoped>

</style>