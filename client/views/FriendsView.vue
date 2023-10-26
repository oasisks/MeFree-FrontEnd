<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FriendsListComponent from "../components/Friends/FriendsListComponent.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

</script>

<template>
    <FriendsListComponent />
</template>
