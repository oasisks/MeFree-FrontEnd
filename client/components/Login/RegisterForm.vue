<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import router from "../../router";

const username = ref("");
const password = ref("");
const name = ref("");
const sex = ref("");
const dob = ref("");
const invalidDOB = ref(false);
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  console.log(username.value, password.value, name.value, sex.value, dob.value);
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
  invalidDOB.value = !regex.test(dob.value);  // if its invalid we need it to be invalid
  console.log("I am here");
  await createUser(username.value, password.value, name.value, sex.value, dob.value);
  await loginUser(username.value, password.value);
  void updateSession();
  console.log("I am here");
  void router.push({ name: "Home"} );
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-name">Name</label>
        <input type="text" v-model.trim="name" id="aligned-name" placeholder="Name" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-name">Sex</label>
        <input type="text" v-model.trim="sex" id="aligned-name" placeholder="Sex" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-name">DOB</label>
        <input type="text" v-model.trim="dob" id="aligned-name" placeholder="MM/DD/YYYY" required />
        <p v-if="invalidDOB" class="warning-text">Invalid DOB</p>
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
.warning-text {
  color:red;
  font-size: 12px;
}
</style>
