<script setup lang="ts">
import { computed } from 'vue'
import { useModularityStore } from '../stores/modularityStore'
import { useToggleStore } from '../stores/toggleStore'

const props = defineProps<{
  componentName: string
  id: string
}>()
const emit = defineEmits([
  'resize-component',
  'move-component',
  'delete-component',
])

const shouldBeTransparent = computed(
  () => useToggleStore().isResizing || useToggleStore().isMoving,
)

function startResizing(event: Event) {
  event.preventDefault()
  useToggleStore().toggleResizing()
  useModularityStore().setResizingComponentId(props.id)
  document.addEventListener('mouseup', stopResizing)
}

function stopResizing() {
  useToggleStore().toggleResizing()
  useModularityStore().setResizingComponentId('')
  document.removeEventListener('mouseup', stopResizing)
  emit('resize-component', props.id)
}

function deleteComponent() {
  console.log('???')
  emit('delete-component', props.id)
}

function startMoving(event: Event) {
  event.preventDefault()
  useToggleStore().toggleMoving()
  useModularityStore().setMovingComponentId(props.id)
  document.addEventListener('mouseup', stopMoving)
}

function stopMoving() {
  useToggleStore().toggleMoving()
  useModularityStore().setMovingComponentId('')
  document.removeEventListener('mouseup', stopMoving)
  emit('move-component', props.id)
}
</script>

<template>
  <div
    id="wrapper-container"
    :class="{ 'resizing-transparency': shouldBeTransparent }"
  >
    <div id="corner-drag" @mousedown="startResizing"></div>
    <div id="corner-move" @mousedown="startMoving"></div>
    <div id="corner-delete" @click="deleteComponent"></div>
    <component :is="componentName" class="wrapper-content"></component>
  </div>
</template>

<style scoped>
#corner-drag {
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: blue;
  border-radius: 50%;
  bottom: 10px;
  right: 10px;
  scale: 1.5;
  cursor: pointer;
}

#corner-delete {
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  scale: 1.5;
  cursor: pointer;
}

#corner-move {
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: yellowgreen;
  border-radius: 50%;
  top: 10px;
  left: 10px;
  scale: 1.5;
  cursor: pointer;
}

#wrapper-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* or auto, based on your preference */
  width: 100%;
  height: 100%;
}

.wrapper-content {
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1em; /* Adjust as necessary */
}

.resizing-transparency {
  opacity: 0.5;
  pointer-events: none;
}
</style>
