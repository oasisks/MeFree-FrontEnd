<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    width: String,
    height: String,
    fontSize: String,
    font: String,
    fontColor: String,
    xPos: String,
    yPos: String,
})

const theme = {
    fontFamily: "'Young Serif', serif"
}
if (props.font === "1") {
    theme.fontFamily = "'Alumni Sans Collegiate One', sans-serif";
} else if (props.font === "2") {
    theme.fontFamily = "'Inconsolata', monospace";
} else if (props.font === "3") {
    theme.fontFamily = "'Noto Serif', serif";
} else if (props.font === "4") {
    theme.fontFamily = "'Pixelify Sans', sans-serif";
} else {
    theme.fontFamily = "'Young Serif', serif";
}

</script>

<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    width: v-bind('$props.width');
    height: v-bind("$props.height");
    font-size: v-bind("$props.fontSize");
    font-family: v-bind('theme.fontFamily');
    align-items: center;
    justify-content: center;
    background-color: rgb(123, 79, 79);
    margin-left: 115px;
    margin-right: 115px;
}
</style>
