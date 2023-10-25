<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { isLoggedIn } = storeToRefs(useUserStore());

</script>

<template>
    

</template>
