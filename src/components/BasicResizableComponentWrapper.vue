<script setup lang="ts">
import { useModularityStore } from '../stores/modularityStore'
import { useToggleStore } from '../stores/toggleStore'

const props = defineProps<{
  componentName: string
  id: string
}>()

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
}
</script>

<template>
  <div id="wrapper-container">
    <div id="corner-drag" @mousedown="startResizing">C</div>
    <component :is="componentName"></component>
  </div>
</template>

<style scoped>
#corner-drag {
  position: absolute;
  height: 20px;
  width: 20px;
  color: violet;
  top: 0px;
  right: 0px;
}

#wrapper-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
