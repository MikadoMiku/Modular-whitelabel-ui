<script setup lang="ts">
import { withDefaults, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
  }>(),
  { name: 'Guest' },
)

const greetingMessage = computed(
  () => `Hello, ${props.name}! Welcome to Modularity.`,
)
</script>

<template>
  <div class="greeting-container">
    <h1>{{ greetingMessage }}</h1>
  </div>
</template>

<style scoped>
.greeting-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #61dafb;
  color: #282c34;
  font-size: 2em;
  font-family: Arial, sans-serif;
}
</style>
