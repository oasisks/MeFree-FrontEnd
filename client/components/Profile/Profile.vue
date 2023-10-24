<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from '../../utils/fetchy';


// the purpose of the profile is just to show information
const name = ref('');
const dob = ref('');
const sex = ref('');
const loaded = ref(false);
const {currentUsername} = storeToRefs(useUserStore());

const getProfile = async () => {
    let value;
    try {
        value = await fetchy("/api/profile", "GET");
    }
    catch (_) {
        return;
    }
    name.value = value.name ? value.name : "";
    dob.value = value.dob ? value.dob : "";
    sex.value = value.sex ? value.sex : "";
}

onBeforeMount(async () => {
    await getProfile();
    loaded.value = true;
})

</script>

<template>
    <div class="flex-container-row">
        <div>
            <p>Profile Pic</p>
        </div>
        <div class="flex-containter-col">
            <p>Name: {{ name }}</p>
            <p>Sex: {{ sex }}</p>
            <p>DOB: {{ dob }}</p>
            <p>Total Points: {{  }}</p>
            
        </div>
    </div>

</template>

<style>

.flex-container-col {
    display: flex;
    flex-direction: column;
}

.flex-container-row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
}

</style>