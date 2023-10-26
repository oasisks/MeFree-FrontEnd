<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import FriendCardComponent from "./FriendCardComponent.vue";
import FriendRequestCardComponent from "./FriendRequestCardComponent.vue";

const requests = ref<Array<Record<string, string>>>([]);
const friends = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);

const {currentUsername} = storeToRefs(useUserStore());

async function getFriendRequests() {
    requests.value = [];
    let result;

    try {
        result = await fetchy("/api/friend/requests", "GET");
    } catch(_) {
        return;
    }
    // requests.value = result;
    result.forEach((request: Record<string, string>) => {
        if (request.status === "pending" && request.from !== currentUsername.value) {
            requests.value.push(request);
        }
    })

}

async function getFriends() {
    try {
        friends.value = await fetchy("/api/friends", "GET");
    } catch(_) {
        return;
    }
}

onBeforeMount(async () => {
    await getFriendRequests();
    await getFriends();
    loaded.value = true;
})

</script>

<template>
    <div class="friend-container">
        <TabView>
            <TabPanel header="Friend Requests">
                <div class="row-cards">
                    <template v-if="loaded && requests.length !== 0" v-for="request in requests" :key="request.status">
                        <FriendRequestCardComponent :request="request" @refreshfriends="getFriends" @refresh-request="getFriendRequests" />
                    </template>
                    <template v-else-if="loaded">
                        <p>No friend requests</p>
                    </template>
                    <template v-else>
                        <p>Loading...</p>
                    </template>
                </div>
            </TabPanel>
            <TabPanel header="Friends">
                <div class="row-cards">
                    <template v-if="loaded && friends.length !== 0" v-for="friend in friends" :key="friend._id">
                        <FriendCardComponent :name="friend" @update-friends="getFriends"/>
                    </template>
                    <template v-else-if="loaded">
                        <p>No Friends</p>
                    </template>
                    <template v-else>
                        <p>Loading</p>
                    </template>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<style scoped>

.friend-container {
    display: flex;
    flex-direction: column;
    margin-top: 2em;
    margin-left: 3em;
    margin-right: 3em;
}

.row-cards {
    display: flex;
    flex-direction: row;
    gap: 2em;
    flex-wrap: wrap;
}
</style>