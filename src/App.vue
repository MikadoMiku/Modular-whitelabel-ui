<script setup lang="ts">
import BasicModularComponent from './components/BasicModularComponent.vue'
import BasicModularAddOverlay from './components/BasicModularAddOverlay.vue'
import { useToggleStore } from './stores/toggleStore'
import { computed } from 'vue'

const showModularAddOverlay = computed(
  () => useToggleStore().addModularItemClicked,
)
</script>

<template>
  <Transition name="slide">
    <BasicModularAddOverlay
      v-if="showModularAddOverlay"
    ></BasicModularAddOverlay>
  </Transition>
  <BasicModularComponent></BasicModularComponent>
</template>

<style scoped>
/* Slide-in transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
