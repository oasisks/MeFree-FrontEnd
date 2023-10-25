<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import AfterLogin from "../components/HomePage/AfterLogin.vue";
import BeforeLogin from "../components/HomePage/BeforeLogin.vue";
const { isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <main>
    <AfterLogin v-if="isLoggedIn"/>
    <BeforeLogin v-else/>
  </main>
</template>

<style scoped>
</style>
