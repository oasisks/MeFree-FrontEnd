<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["groupData"]);
const reasonRef = ref("");
const wordRef = ref("");
const visible = ref(false);
const emit = defineEmits(["refreshVotes"]);

async function createVote() {
    // when we create a vote, all users within the vote will have access to that vote
    // the user needs to have sufficient points to even vote
    // const endpoint = `/groups/`
    const groupId = props.groupData._id;
    // when creating a vote,
    // the reasona dn word must be filled
    if (reasonRef.value === "" || wordRef.value === "") {
        console.log("not all fields are filled");
        return;
    }
    
    const endpoint = `/api/groups/${groupId}/censoredwords`;
    const word = wordRef.value;
    const reason = reasonRef.value;
    const query = {word, reason};
    let result;
    try {
        result = await fetchy(endpoint, "POST", {query});
    } catch (_) {
        return;
    }
    visible.value = false;
    emit("refreshVotes");
}
</script>

<template>
    <Button @click="visible = true" style="font-weight: bold; background-color: #449DD1;">
        <div class="row">
            <i class="pi pi-plus" style="font-size: 1rem"></i>
            <span>Create vote</span>
        </div>
    </Button>
    <Dialog v-model:visible="visible" modal header="Create Vote" style="width: 50vw">
        <div class="column-container">
            <p>
                Welcome to the voting function of groups. 
                Within here, you create a vote by spending 100 points. 
                Now, what can we vote?
                You can vote on censoring words!!! Just put in a reason and the word you want to censor.
                Users can then vote on your words. There are no time limits to your vote. The vote will cease to exist the moment there is a majority disproval. 
                However, once there is a majority approval, the word will be censored.
            </p>
            <div class="row-inputs">
                <div class="column-container">
                    <p>Reason</p>
                    <InputText v-model="reasonRef"/>
                </div>
                <div class="column-container">
                    <p>Word</p>
                    <InputText v-model="wordRef"/>
                </div>
            </div>
            <Button label="Create Vote" @click="createVote" style="background-color: #449DD1;">
            </Button>
        </div>
    </Dialog>
</template>

<style scoped>

.row {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
}

.row-inputs {
    display: flex;
    flex-direction: row;
    gap: 2em;
}

.column-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
}
</style>