<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from '../../utils/fetchy';

const props = defineProps(["voteId", "groupTitle"]);
const scope = ref("");
const voteData = ref<Record<string, string>>();
const loaded = ref(false);
const alreadyVoted = ref(false);
const emit = defineEmits(["refreshVotes"]);
const groupTitle = ref("");

const userStore = useUserStore();
const { currentUsername } = storeToRefs(userStore);

async function getVote() {
    let result;
    try {
        result = await fetchy(`/api/votes/${props.voteId}`, "GET");
    } catch (_) {
        return;
    }

    voteData.value = result;
}

async function voteYes() {
    // when we vote yes, we need to add a counter to the yes counter
    // we then need to check if its majority vote yet.
    // if it is majority vote, we set vote status to 'passed'
    const totalCount = voteData.value!.totalCount;
    let result;
    try {
        result = await fetchy(`/api/votes/${voteData.value!._id}`, "PATCH")
    } catch (_) {
        return;
    }
    const percent = result.yesCount.length / totalCount.length;
    if (percent >= 0.51 ) {
        const word = voteData.value!.target;
        const tokens = props.groupTitle.split(" ");
        const censoredWordList = tokens[tokens.length - 1];
        const status = "passed";
        try {
            const query = {status}
            result = await fetchy(`/api/vote/${voteData.value!._id}`, "PATCH", {query});
        } catch (_) {
            return;
        }
        try {
            const query = {word};
            result = await fetchy(`/api/censorwordlist/add/${censoredWordList}`, "PATCH", {query});
        } catch (_) {
            return;
        }
        console.log(result);
    }
    // either way, once we vote yes, the vote needs to disapear
    // we also need to add the word to the groupwordlist
    emit("refreshVotes");
    await checkIfAlreadyVoted();
}

async function checkIfAlreadyVoted() {
    const yesCount = voteData.value!.yesCount;
    let user;

    try {
        user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    }
    catch (_) {
        return;
    }

    alreadyVoted.value = yesCount.includes(user._id);
}

async function voteNo() {
    // when we vote no, we need to update the database 
    // if the vote majority is no, then we need to update the status to rejected
    let result;
    const totalCount = voteData.value!.totalCount;

    try {
        result = await fetchy(`/api/votes/nos/${voteData.value!._id}`, "PATCH")
    } catch (_) {
        return;
    }
    const percent = result.noCount.length / totalCount.length;

    if (percent >= 0.51 ) {
        const status = "rejected";
        const query = {status}
        try {
            result = await fetchy(`/api/vote/${voteData.value!._id}`, "PATCH", {query});
        } catch (_) {
            return;
        }
    }
    emit("refreshVotes");
    await checkIfAlreadyVoted();
}


onBeforeMount(async () => {
    console.log(props.voteId);
    await getVote();
    await checkIfAlreadyVoted();

    // we need to set the group title
    const tokens: Array<string> = props.groupTitle.split(" ");
    const length = tokens.length;
    console.log(tokens.slice(0, length - 1));
    groupTitle.value = tokens.slice(0, length - 1).join(" ");
    loaded.value = true;
});

</script>

<template>
    <div class="vote-style" v-if="loaded && !alreadyVoted">
        <Card v-if="voteData!.status !== 'passed'">
            <template #title>
                <p>{{ voteData!.title }}</p>
            </template>
            <template #subtitle>
                <p>In Group: {{ groupTitle }}</p>
                <p>Reasoning: {{ voteData!.reason }}</p>
            </template>
            <template #content>
                <div class="buttons">
                    <Button label="Yes" @click="voteYes" style="background-color: #449DD1;"/>
                    <Button label="No" @click="voteNo" style="background-color: #A72608;"/>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>

.vote-style {
    margin-bottom: 2em;
    margin-right: 1.5em;
    margin-left: 1.5em;
}
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>