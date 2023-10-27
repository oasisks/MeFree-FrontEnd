<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from '../../utils/fetchy';


const props = defineProps(["post"]);
const message = ref<Record<string, string>>();

async function getPostMessage(id: string) {
    try {
        message.value = await fetchy(`/api/posts/post_ids/${id}`, "GET");
    } catch(_) {
        return;
    }
}

onBeforeMount(async () => {
    await getPostMessage(props.post);
})
</script>
<template>
    <div class="card-margin">
        <Card v-if="message !== undefined">
            <template #title >
                {{ message.author }}
            </template>
            <template #content>
                <div class="content-box">
                    <p>{{ message.content }}</p>
                    <p>{{ new Date(message.dateCreated).toLocaleDateString() }}</p>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.card-margin {
    margin-bottom: 1em;
}

.content-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>