<script setup lang="ts">

import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateVote from "./CreateVote.vue";
import GroupCard from "./GroupCard.vue";
import GroupChatComponent from "./GroupChatComponent.vue";


const loaded = ref(false);
const groups = ref<Array<Record<string, string>>>([]);
const groupTitle = ref("");
const searchQuery = ref("");
const showChat = ref(false);
const chatData = ref<Record<string, string>>();
const chatMessage = ref("");
const selectedUser = ref();
const emit = defineEmits(["refreshVotes"]);
const friends = ref<Array<string>>([]);

async function getGroups() {
    // we are trying to get all of the groups associated with the user
    try {
        groups.value = await fetchy("/api/group", "GET");
    } catch (_) {
        return;
    }
}

async function inviteToGroup() {
    // this function will deal inviting all of the users to a particular group

    console.log(selectedUser.value);
    // first check if there are even users to invite into
    if (selectedUser.value === undefined) {
        return;
    }

    let result;
    try {
        const group_id = chatData.value!._id;
        // we need the group id and also the user id
        // in this case we will only need to send one request to the user
        result = await fetchy(`/api/group/${group_id}/${selectedUser.value}`, "PATCH");
    } catch (_) {
        return;
    }

    console.log(result);
}

async function createGroup() {
    const title = groupTitle.value;
    const query: Record<string, string> = { title }
    try {
        await fetchy("/api/groups", "POST", { query });
    } catch (_) {
        return;
    }
    await getGroups();
}

async function searchGroup() {
    if (searchQuery.value === "") {
        // just return everything 
        return await getGroups();
    }

    const newGroup: Array<Record<string, string>> = [];
    groups.value.forEach((group) => {
        if (group.title === searchQuery.value) {
            newGroup.push(group);
        }
    })

    groups.value = newGroup;
}

async function getFriends() {
    let result;
    try {
        result = await fetchy("/api/friends", "GET");
    } catch (_) {
        return;
    }

    result.forEach((friend: string) => {
        friends.value.push(friend);
    })
}

async function showGroupChat(groupData: Record<string, string>) {
    // this function toggles the group chat
    showChat.value = true;
    chatData.value = groupData;
}

async function onPressEnter() {
    // when we press the enter key, we send the message
    if (chatMessage.value === "") {
        return;
    }
    let post;
    let query;
    // we need to first create a post for the group
    try {
        if (chatData.value === undefined) {
            return;
        }
        const content = chatMessage.value;
        query = {content};
        post = await fetchy("/api/posts", "POST", {query});
        post = post.post._id;
        query = { post };
        const _id = chatData.value._id;
        const data = await fetchy(`/api/groups/${_id}`, "PATCH", {query});
        chatData.value = data.group;
    } catch(_) {
        return;
    }
    await getGroups();
    chatMessage.value = "";
}



onBeforeMount(async () => {
    await getGroups();
    await getFriends();
    loaded.value = true;
});

</script>

<template>
    <div v-if="!showChat" class="column-group">
        <Toolbar>
        <template #center>
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText placeholder="Search" v-model="searchQuery" />
                <Button @click="searchGroup" label="Submit">
                    
                </Button>
            </span>
        </template>

        <template #end> 
            <div class="column-create">
                <div class="row-create">
                    <InputText type="text" placeholder="title" v-model="groupTitle"/>
                    <Button v-if="groupTitle === ''" disabled label="Create Group">
                    </Button>
                    <Button v-else @click="createGroup" label="Create Group">
                    </Button>
                </div>
                <small v-if="groupTitle === ''">Can't left blank</small>
            </div>
        </template>
    </Toolbar>
    <section v-if="loaded && groups.length !== 0">
        <article v-for="group in groups" :key="group._id">
            <GroupCard @show-chat="showGroupChat" :group="group" />
        </article>
    </section>
    <p v-else-if="loaded">You have no groups</p>
    <p v-else>Loading....</p>
    </div>

    <div v-else class="chat-column">
        <!-- In here we will show the chat logs and also the ability to chat -->
        <div class="row-space-between">
            <div class="row">
                <Button @click="() => {
                        showChat = false;
                }" style="background-color: #4A484E;">
                    <div class="row">
                        <i class="pi pi-arrow-left" style="font-size: 1rem"></i>
                        <span style="font-weight: bold;">Back Button</span>
                    </div>
                </Button>
                <CreateVote @refresh-votes="emit('refreshVotes')" :group-data="chatData"/>
            </div>
            <div class="row">
                <Dropdown v-model="selectedUser" :options="friends" placeholder="Select Users">
                </Dropdown>
                <Button label="Invite" @click="inviteToGroup" style="background-color: #449DD1;"/>
            </div>
        </div>
        <ScrollPanel style="width: 100%; height: 80%; border-style: groove; border-width: 0.5em;">
        <div v-if="chatData !== undefined" v-for="post in chatData.posts">
            <GroupChatComponent :post="post"/>
        </div>
        </ScrollPanel>
        <div >
            <InputText style="width: 100%;" placeholder="Message" v-model="chatMessage" @keydown.enter="onPressEnter"/>
        </div>

    </div>

</template>

<style scoped>

.column-create {
    display: flex;
    flex-direction: column;
}

.row-create {
    display: flex;
    flex-direction: row;
}

.column-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
}

.chat-column {
    display: flex;
    flex-direction: column;
    justify-content: end;
    height: 650px;
    gap: 0.5em;
}

.row {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
}

.row-space-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

</style>