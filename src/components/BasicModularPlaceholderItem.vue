<script setup lang="ts">
import { computed, ref } from 'vue'
import modularityEmitter from '../emitters/modularityEmitter'
import { useToggleStore } from '../stores/toggleStore'

const props = defineProps<{
  horizontalAxisPos: number
  verticalAxisPos: number
  color: string | undefined
  id: string
}>()
const emit = defineEmits(['add-item'])
const chosenComponent = ref('')

const isResizing = computed(() => useToggleStore().isResizing)
const isChoosingComponent = ref(false)

const areaColoration = computed(() => {
  if (!isResizing.value && !props.color) return {}
  return {
    'background-color': props.color,
  }
})

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
  if (!isChoosingComponent.value) {
    console.log('hello')
    modularityEmitter.on('component-chosen', componentChosen)
  } else {
    modularityEmitter.off('component-chosen', componentChosen)
  }
  useToggleStore().toggleModularItemClicked()
  isChoosingComponent.value = !isChoosingComponent.value
}
</script>

<template>
  <div id="placeholder-item" :style="areaColoration">
    <button v-if="!isResizing" id="add-item-button" @click="addModularItem">
      <span id="add-modular-item">+</span>
    </button>
  </div>
</template>

<style scoped>
#placeholder-item {
  border: 1px solid black;
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
