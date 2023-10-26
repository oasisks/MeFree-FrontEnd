<script setup lang="ts">
import { fetchy } from '../../utils/fetchy';


const props = defineProps(["name"]);
const emit = defineEmits(["updateFriends"]);

// here we need to perform the logic of getting rid of friends
async function deleteFriend() {
    try {
        await fetchy(`/api/friends/${props.name}`, "DELETE");
    } catch (_) {
        return;
    }
    emit("updateFriends");
}
</script>

<template>
    <Card class="card-style">
        <template #title>{{ props.name}}</template>
        <template #subtitle>Status: Friend</template>
        <template #content>
            <Button @click="deleteFriend">
                Delete Friend
            </Button>
        </template>
    </Card>

</template>

<style scoped>

.card-style {
    width: 25%;
    margin-top: 2em;
}

</style>