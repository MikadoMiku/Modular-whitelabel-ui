<script setup lang="ts"></script>

<template>
  <div id="test-body">
    <div>Hello world!</div>
    <div class="button-container">
      <button class="button-test-body">Test button</button>
    </div>
  </div>
</template>

<style scoped>
#test-body {
  height: 100%;
  width: 100%;
  color: red;
}

.button-container {
  height: 50%;
  width: 100%;
  background-color: blueviolet;
}

.button-test-body {
  color: white;
  background-color: black;
  height: 60%;
  width: 80%;
}
</style>
