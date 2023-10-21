<script setup lang="ts">
import { ComponentPublicInstance, Ref, ref } from 'vue'

/* Adding an element to this modular component creates a proxy of it in this code? Meaning that we never actually move the reference of the element around? We alter the position in which the grid shows it in */

interface SubComponent {
  name: string
  componentRef?: Ref<ComponentPublicInstance>
  horizontalStart: number
  horizontalEnd: number
  verticalStart: number
  verticalEnd: number
}

/* const horizontalAxisCount = ref(0)
const verticalAxisCount = ref(0) */
const subComponentPositions = ref<SubComponent[]>([])
subComponentPositions.value.push({
  name: 'test',
  horizontalStart: 0,
  horizontalEnd: 2,
  verticalStart: 0,
  verticalEnd: 2,
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>
