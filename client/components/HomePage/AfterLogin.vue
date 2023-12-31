<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import GroupListComponent from "../Group/GroupListComponent.vue";
import VoteComponent from "../Group/VoteComponent.vue";
import Spotlight from "../Spotlights/Spotlight.vue";


const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
let spotlights = ref<Array<Record<string, string>>>([]);
let groups = ref<Array<Record<string, string>>>([]);
const friendRequests = ref<Map<string, Array<Record<string, string>>>>(new Map());
const loaded = ref(false);
const spotlightSelected = ref(false);
const editing = ref(false);
const content = ref("");
const user_spotlight = ref<Record<string, string>>();
const friends = ref<Array<Record<string, string>>>([]);
const votes = ref<Map<string, string>>(new Map());

async function getSpotlights() {
    let topicResults;

    try {
        topicResults = await fetchy("/api/spotlights", "GET");
    } catch(_) {
        return;
    }

    spotlights.value = topicResults;
}

async function getGroups() {
    let groupResults;

    try{
        groupResults = await fetchy("/api/group", "GET");
    } catch(_) {
        return;
    }

    groups.value = groupResults;
}

async function onClickToSpotlight() {
    editing.value = true;
}

async function update() {
    let result;

    // now we want to check each topic and see if the expiry date is over
    spotlights.value.forEach(async (spotlight) => {
        const createDate = new Date(spotlight.dateCreated);
        const today = new Date();

        const diff = (today.getTime() - createDate.getTime()) / (1000 * 60 * 60)
        // if we have passed the 24 hour period
        if (diff >= 24) {
            // we will delete that spotlight
            try {
                await fetchy(`/api/spotlights/${spotlight._id}`, "DELETE");
            } catch (_) {
                
            }
        }
        const username = spotlight.title.replace("Spotlight: ", "");

        if (username === currentUsername.value) {
            spotlightSelected.value = true;
            content.value = spotlight.content;
            user_spotlight.value = spotlight;
        }
    })

    // // once we delete all we need, we just add in a total of 10 spotlights
    let count = spotlights.value.length;

    while (count < 10) {
        try {
            result = await fetchy("/api/spotlights", "POST")
            if (result.topic === null) {
                break;
            }
            
            if (currentUsername.value === result.topic.title.replace("Spotlight: ", "")) {
                spotlightSelected.value = true;
                content.value = result.topic.content;
                user_spotlight.value = result.topic;
            }
        } catch(_) {

        }
        count++;
    }

    await getSpotlights();
}

async function saveContent() {
    // once this function is called, we will save whatever
    // is in context to the database
    let _id = user_spotlight.value ? user_spotlight.value._id : "";
    let new_content = content.value;
    console.log(new_content);
    let query: Record<string, string> = { content: new_content };
    try {
        let result = await fetchy(`/api/spotlights/${_id}`, "PATCH", { query });
        console.log(result);
    } catch(_) {
        return;
    }
    await getSpotlights();
    editing.value = false;
}

async function cancelEdit() {
    editing.value = false;
}

async function getFriendRequest() {
    let result;
    try {
        result = await fetchy("/api/friend/requests", "GET");
    } catch(_) {
        return;
    }

    result.forEach((request: Record<string, string>) => {
        const from = request.from;
        const to = request.to;
        // we don't care about any requests that has already been accepted
        if (request.status === "accepted") {
            return;
        }
        if (friendRequests.value.has(from)) {
            const value = friendRequests.value.get(from);
            value!.push(request);
        } else {
            friendRequests.value.set(from, [request]);
        }
        if (friendRequests.value.has(to)) {
            const value = friendRequests.value.get(to);
            value!.push(request);
        } else {
            friendRequests.value.set(to, [request]);
        }
    })
}

async function getVotes() {
    // this function grabs all the votes that is related to the user
    // we will need to get all of the users related groups
    // and then list each of the votes in the votes component
    votes.value = new Map();
    let result;
    try {
        result = await fetchy("/api/groups", "GET");
    } catch (_) {
        return;
    }
    result.forEach(async (group: Record<string, string>) => {
        const vote = group.votes;
        // we need to grab all of the votes that are pending
        const votePromises = [];
        for (let i = 0; i < vote.length; i++) {
            const v = vote[i];
            votePromises.push(fetchy(`/api/votes/${v}`, "GET"));
        }

        const votingData = await Promise.all(votePromises);
        votingData.forEach((v: Record<string, string>) => {
            if (v.status === 'pending') {
                votes.value.set(v._id, group.title + " " + group.censoredWordList);
            }
        })
    });
}

async function getFriends() {
    try {
        friends.value = await fetchy("/api/friends", "GET");
    } catch (_) {
        return;
    }
}

onBeforeMount(async () => {
    await getSpotlights();
    await getGroups();
    // TOOD: as we log in, we need to check if there is a new spotlight
    // that needs to be updated
    // very sus but its the best we can do without a dedicated server
    await update();
    await getFriendRequest();
    await getFriends();
    await getVotes();
    // I also need to load in the posts associated with the spotlight
    loaded.value = true;
})
</script>

<template>
    <div v-if="isLoggedIn" class="row-tabs">
        <div class="column-home">
        <TabView>
            <TabPanel header="Spotlights" style="font-family: 'Roboto', sans-serif;">
                <section v-if="loaded && spotlights.length !== 0">
                    <article v-for="topic in spotlights" :key="topic._id">
                        <Spotlight :topic="topic" :friends="friends" :requests="friendRequests.get(topic.title.replace('Spotlight: ', ''))"/>
                    </article>
                </section>
                <p v-else-if="loaded">No spotlights found :(</p>
                <p v-else>Loading....</p>
            </TabPanel>

            <TabPanel header="Your Groups">
                <GroupListComponent @refreshVotes="getVotes"/>
            </TabPanel>
        </TabView>
        </div>
        <div class="column-right" v-if="loaded">
            <Card>
                <template #title> Spotlight Notification</template>
                <template #content>
                    <template v-if="spotlightSelected">
                        <p>Wow you got selected to be on the spotlight. Please click the button below and write your story :).</p>
                        <Button style="background-color: #FFE066; color: #0D0A12;" label="Click me for your spotlight :)" v-if="!editing" @click="onClickToSpotlight">
                            
                        </Button>
                        <div v-else class="column-flex">
                            <Textarea v-model="content" rows="5" cols="60" autoResize>

                            </Textarea>
                            <div class="row-flex">
                                <Button @click="saveContent" label="Save" style="background-color: #449DD1;">
                                    
                                </Button>
                                <Button @click="cancelEdit" label="Cancel" style="background-color: #A72608;">
                                    
                                </Button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <p>Sorry, you are not selected to be a spotlight just yet. Come back after 24 hours and see if you are selected.</p>
                    </template>
                </template>
            </Card>
            <Card>
                <template #title> Pending Votes</template>
                <template #content>
                    <p>This is the place where all of your votes from all of your groups exists. Feel free to click on them when you feel like it :).</p>
                    <template v-if="votes.size !== 0" v-for="vote in votes" :key="vote[1]">
                        <VoteComponent @refreshVotes="getVotes" :voteId="vote[0]" :groupTitle="vote[1]" />
                    </template>
                </template>
            </Card>
        </div>
        <div v-else class="column-right">
            <p>loading</p>
        </div>
    </div>

    <!-- <PostListComponent /> -->
</template>

<style scoped>

.column-home {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding-left: 5em;
    padding-top: 2em;
    inline-size: 80%;
    overflow-wrap: break-word;
}

.row-tabs{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}

.column-flex {
    display: flex;
    flex-direction: column;
}

.row-flex {
    display: flex;
    flex-direction: row;
    gap: 2em;
}

.column-right {
    padding-left: 5em;
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
    margin-right: 5em;
    overflow-wrap: break-word;
}

</style>