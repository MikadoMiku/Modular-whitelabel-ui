<script setup lang="ts">
import { ref } from 'vue'

const currentComponent = ref('TestChildComponent')
const switchFlag = ref(false)
function changeComponents() {
  if (switchFlag.value) {
    currentComponent.value = 'TestChildComponent'
  } else {
    currentComponent.value = 'TestChildComponentSwitch'
  }
  switchFlag.value = !switchFlag.value
}
</script>

<template>
  <div>
    <component :is="currentComponent"></component>
    <button id="switch-component-button" @click="changeComponents">
      Switch components dynamically
    </button>
  </div>
</template>

<style scoped>
#switch-component-button {
  height: 50px;
  width: 325px;
  color: cadetblue;
  font-size: large;
  font-weight: bold;
  border-radius: 10px;
  border-width: 1px;
  border-color: aliceblue;
  border-style: solid;
}
</style>
