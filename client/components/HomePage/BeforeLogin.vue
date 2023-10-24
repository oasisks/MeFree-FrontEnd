<script setup lang="ts">
import router from "../../router";

function onClick() {
  console.log("I clciked a button");
  void router.push("Login");
}
</script>

<template>
  <main>
    <div class="flex-container-column">
      <div class="flex-container-row-red">
        <Image src="/People.jpg" width="413" height="479"/>
        <div class="flex-container-column">
          <h1 class="BigText">made for groups</h1>
          <h1 class="SmallText">one vote, set your rules</h1>
        </div>
      </div>
      <div class="flex-container-row-blue">
        <div class="flex-container-column">
          <h1 class="BigText">freely customize</h1>
          <h1 class="SmallText">made styling easy</h1>
        </div>
        <Image src="/Gear.jpg"/>
      </div>
      <div class="flex-container-row-yellow">
        <Image src="/lightbulb.jpg" width="481" height="481"/>
        <div class="flex-container-column">
          <h1 class="BigText">giving the spotlight</h1>
          <h1 class="SmallText">one platform, many spotlights</h1>
        </div>
      </div>
      <div class="ButtonBackground">
        <Button @click="onClick" size="large" rounded>
            Click to sign up!
          </Button>
      </div>
    </div>
    <!-- <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->
    <!-- <PostListComponent /> -->
    <!-- font-family: 'Alumni Sans Collegiate One', sans-serif;
font-family: 'Inconsolata', monospace;
font-family: 'Noto Serif', serif;
font-family: 'Pixelify Sans', sans-serif;
font-family: 'Roboto', sans-serif;
font-family: 'Young Serif', serif; -->
  </main>
</template>

<style scoped>
.flex-container-column {
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
}
.flex-container-row-red {
  padding: 1em;
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
  align-items: center;
  background-color: rgba(167, 38, 8, 0.75);
}
.flex-container-row-blue {
  padding: 1em;
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
  align-items: center;
  background-color: #449DD1;
}
.flex-container-row-yellow {
  padding: 1em;
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
  align-items: center;
  background-color: #FFE066
}

.BigText {
  text-transform: uppercase;
  color: black;
  font-size: 3.5em;
}
.SmallText {
  text-transform: uppercase;
  color: black;
  font-size: 2em;
}

.ButtonBackground {
  background-color: rgb(245, 224, 224);
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 2em;
}
</style>