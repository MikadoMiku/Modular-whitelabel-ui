<script setup lang="ts">
import { onMounted, ref } from 'vue'

const currentDate = ref('')
const currentTime = ref('')

function getFormattedDate() {
  const date = new Date()
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getFormattedTime() {
  const date = new Date()
  return date.toLocaleTimeString()
}

currentDate.value = getFormattedDate()
currentTime.value = getFormattedTime()

function updateTime() {
  setInterval(() => {
    currentTime.value = getFormattedTime()
  }, 1000)
}

onMounted(() => {
  updateTime()
})
</script>

<template>
  <div class="header-container">
    <div class="date-time">{{ currentDate }} | {{ currentTime }}</div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #282c34;
  color: #61dafb;
  font-size: 2em;
  font-family: Arial, sans-serif;
}

.date-time {
  border: 2px solid #61dafb;
  border-radius: 10px;
}
</style>
