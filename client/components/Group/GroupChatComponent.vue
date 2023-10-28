<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from '../../utils/fetchy';


const props = defineProps(["post", "censoredWordlistId"]);
const message = ref<Record<string, string>>();
const censoredWordList = ref(new Set());
const loaded = ref(false);
const containsCensored = ref(false);

async function getPostMessage(id: string) {
    try {
        message.value = await fetchy(`/api/posts/post_ids/${id}`, "GET");
    } catch(_) {
        return;
    }
}

async function getCensoredWordlist() {
    // get the censored word list
    let result;
    try {
        result = await fetchy(`/api/censorwordlist/${props.censoredWordlistId}`, "GET");
    } catch (_) {
        return;
    }
    censoredWordList.value = new Set([...result.words]);
    result.words.forEach((word: string) => {
        console.log(word, message.value!.content, message.value!.content.includes(word));
        if (message.value!.content.includes(word)) {
            containsCensored.value = true;
        }
    })
}

onBeforeMount(async () => {
    await getPostMessage(props.post);
    await getCensoredWordlist();
    loaded.value = true;
})
</script>
<template>
    <div class="card-margin" v-if="message !== undefined">
        <Card v-if="!containsCensored">
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
        <Card v-else>
            <template #title>
                Censored Word
            </template>
            <template #content>
                <div class="content-box">
                    <p>There is a word that has been censored.</p>
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