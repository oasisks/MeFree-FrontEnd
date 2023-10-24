<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import AfterLogin from "../components/HomePage/AfterLogin.vue";
import BeforeLogin from "../components/HomePage/BeforeLogin.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

function onClick() {
  console.log("I clciked a button");
  void router.push("Login");
}
</script>

<template>
  <main>
    <AfterLogin v-if="isLoggedIn"/>
    <BeforeLogin v-else/>
  </main>
</template>

<style scoped>
</style>
