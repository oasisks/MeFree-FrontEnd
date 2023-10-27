<script setup lang="ts">

import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["request"]);
const emit = defineEmits(["refreshRequest", "refreshfriends"]);

const dateCreated = ref<Date>(new Date());
const now = ref<Date>(new Date());

dateCreated.value = new Date(props.request.dateCreated)


async function acceptRequest() {
    const from = props.request.from;
    const to = props.request.to;
    try {
        await fetchy(`/api/friend/accept/${from}`, "PUT");
    } catch (_) {
        return;
    }
    emit("refreshRequest");
    emit("refreshfriends");
}

async function declineRequest() {
    const from = props.request.from;

    try {
        await fetchy(`/api/friend/reject/${from}`, "PUT");
    } catch (_) {
        return;
    }
    emit("refreshRequest");
}

</script>

<template>
    <div class="column-cards">
        <Card>
            <template #title>{{ props.request.from }}</template>
            <template #subtitle>Sent a friend request</template>
            <template #content>
                <div>
                    <p>Request Sent {{ now.getHours() - dateCreated.getHours() }} Hours Ago</p>
                </div>
                <div class="row-buttons">
                    <Button @click="acceptRequest" label="Accept Request" style="background-color: #449DD1;">
                        
                    </Button>
                    <Button @click="declineRequest" label="Decline Request" style="background-color: #A72608;">
                        
                    </Button>
                </div>

            </template>
        </Card>
    </div>

    
</template>

<style scoped>

.column-cards {
    display: flex;
    flex-direction: column;
    width: 50%;
    margin-top: 2em;
}

.row-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
}

</style>