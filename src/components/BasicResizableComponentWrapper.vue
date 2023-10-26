<script setup lang="ts">
import { computed } from 'vue'
import { useModularityStore } from '../stores/modularityStore'
import { useToggleStore } from '../stores/toggleStore'

const props = defineProps<{
  componentName: string
  id: string
}>()
const emit = defineEmits(['resize-component'])

const isResizing = computed(() => useToggleStore().isResizing)

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
</script>

<template>
  <div id="wrapper-container" :class="{ 'resizing-transparency': isResizing }">
    <div id="corner-drag" @mousedown="startResizing">C</div>
    <component :is="componentName" class="wrapper-content"></component>
  </div>
</template>

<style scoped>
#corner-drag {
  position: absolute;
  height: 20px;
  width: 20px;
  color: violet;
  bottom: 0px;
  right: 0px;
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
