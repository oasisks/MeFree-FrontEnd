<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import ComponentBox from "../components/ComponentBox/ComponentBox.vue";
import Profile from "../components/Profile/Profile.vue";

const { currentUsername } = storeToRefs(useUserStore());

</script>

<template>
  <div class="flex-container-col">
    <ComponentBox width="84%" font="3" height="358px">
      <Profile/>
    </ComponentBox>
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
}

</style>

