<script setup lang="ts">
import { ref } from 'vue'
import { getAllComponents } from '../componentRegistry'
import modularityEmitter from '../emitters/modularityEmitter'

const collapsed = ref(false)
const registeredComponents = ref(getAllComponents())

function collapse() {
  collapsed.value = !collapsed.value
}

function chooseComponent(componentName: string) {
  modularityEmitter.emit('component-chosen', componentName)
}
</script>

<template>
  <div
    class="modular-addition-overlay"
    :class="{ 'modular-addition-overlay-collapsed': collapsed }"
  >
    <div id="modular-addition-container">
      <button id="add-overlay-collapse-button" @click="collapse"></button>
      <div class="addable-component-list">
        <button
          v-for="(component, index) in registeredComponents"
          :key="index"
          @click="chooseComponent(component)"
        >
          {{ component }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modular-addition-overlay {
  height: 60%;
  width: 20%;
  position: absolute;
  top: 20%;
  right: 0;
  z-index: 1000; /* ensure it appears on top */
  background-color: rgba(0, 0, 0, 0.8); /* semi-transparent black */
  transition: right 0.3s ease-in-out;
}

.modular-addition-overlay-collapsed {
  right: -20%;
}

#modular-addition-container {
  height: 100%;
  width: 100%;
  position: relative;
}

#add-overlay-collapse-button {
  position: absolute;
  height: 15%;
  width: 20px;
  top: 42.5%;
  left: -10px;
  background-color: white;
}

.addable-component-list {
  height: 100%;
  width: 100%;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 10%;
  overflow-y: auto;
  grid-gap: 10px;
}
</style>
