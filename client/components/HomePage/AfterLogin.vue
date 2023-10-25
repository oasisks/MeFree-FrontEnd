<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import PostListComponent from "../Post/PostListComponent.vue";
import Spotlight from "../Spotlights/Spotlight.vue";


const { isLoggedIn } = storeToRefs(useUserStore());
let spotlights = ref<Array<Record<string, string>>>([]);
let groups = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);

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

async function update() {
    let result;

    // now we want to check each topic and see if the expiry date is over
    spotlights.value.forEach(async (spotlight) => {
        const createDate = new Date(spotlight.dateCreated);
        const today = new Date();

        const diff = (today.getTime() - createDate.getTime()) / (1000 * 60 * 60)
        console.log(diff);
        // if we have passed the 24 hour period
        if (diff >= 24) {
            // we will delete that spotlight
            try {
                await fetchy(`/api/spotlights/${spotlight._id}`, "DELETE");
            } catch (_) {
                
            }
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
        } catch(_) {

        }
        count++;
    }

    await getSpotlights();
}


onBeforeMount(async () => {
    await getSpotlights();
    await getGroups();
    // TOOD: as we log in, we need to check if there is a new spotlight
    // that needs to be updated
    // very sus but its the best we can do without a dedicated server
    await update();

    // I also need to load in the posts associated with the spotlight
    loaded.value = true;
})
</script>

<template>
    <div v-if="isLoggedIn" class="row-tabs">
        <div class="column-home">
        <TabView>
            <TabPanel header="Spotlights">
                <section v-if="loaded && spotlights.length !== 0">
                    <article v-for="topic in spotlights" :key="topic._id">
                        <Spotlight :topic="topic"/>
                    </article>
                </section>
                <p v-else-if="loaded">No spotlights found :(</p>
                <p v-else>Loading....</p>
            </TabPanel>

            <TabPanel header="Your Groups">
                <section v-if="loaded && groups.length !== 0">
                    <article v-for="group in groups" :key="group._id">
                        <p>Insert a group component</p>
                    </article>
                </section>
                <p v-else-if="loaded">No groups found :(</p>
                <p v-else>Loading....</p>
            </TabPanel>
        </TabView>
        </div>
        <div class="column-right">
            <p>Place to notify that its your turn for spotlight</p>
            <p>Pending votes</p>
        </div>
    </div>

    <PostListComponent />
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
    align-items: center;
    width: 90%;
}

.column-right {
    display: flex;
    flex-direction: column;
}

</style>