<script setup lang="ts">
import { ref } from 'vue';
import router from '../../router';

const names = ref([["Home","/home.jpg", "/"], ["Groups", "/group.jpg", "Groups"], ["Forums", "/forum.jpg", "Forums"], ["Friends", "/friends.jpg", "Friends"], ["Spotlights", "/spotlight.jpg", "Spotlights"]]);

function onClick(route: string) {
    void router.push(route);
}
</script>

<template>
    <div class="container">
        <h1>Menu</h1>
        <template v-for="name in names">
            <div class="row">
                <img v-bind:src="name[1]" width="24" height="24"/>
                <button @click="onClick(name[2])">{{name[0]}}</button>
            </div>
        </template>
    </div>
</template>

<style scoped>

.container {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    padding: 1em;
    gap: 0.25em;
    background-color: gray;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
}
</style>    