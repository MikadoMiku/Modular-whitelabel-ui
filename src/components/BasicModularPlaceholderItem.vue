<script setup lang="ts">
import { ref } from 'vue'
import modularityEmitter from '../emitters/modularityEmitter'
import { useToggleStore } from '../stores/toggleStore'

const props = defineProps<{
  horizontalAxisPos: number
  verticalAxisPos: number
}>()
const emit = defineEmits(['add-item'])
const chosenComponent = ref('')

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return { 'background-color': color }
}

function componentChosen(componentName: string) {
  console.log('component chosen')
  chosenComponent.value = componentName

  modularityEmitter.off('component-chosen', componentChosen)
  emit('add-item', {
    componentName: chosenComponent.value,
    horizontalAxisPos: props.horizontalAxisPos,
    verticalAxisPos: props.verticalAxisPos,
  })
}

function addModularItem() {
  console.log('hello')
  useToggleStore().toggleModularItemClicked()
  modularityEmitter.on('component-chosen', componentChosen)
}
</script>

<template>
  <div id="placeholder-item" :style="getRandomColor()">
    <button id="add-item-button" @click="addModularItem">
      <span id="add-modular-item">+</span>
    </button>
  </div>
</template>

<style scoped>
#placeholder-item {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#add-modular-item {
  font-size: large;
  font-weight: bold;
}

#add-item-button {
  border-radius: 50%;
  width: 30%;
  aspect-ratio: 1;
  border: 0px;
  outline: none;
}
</style>
