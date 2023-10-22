<script setup lang="ts">
import { computed, ref } from 'vue'
/* Adding an element to this modular component creates a proxy of it in this code? Meaning that we never actually move the reference of the element around? We alter the position in which the grid shows it in */

interface SubComponent {
  name: string
  hide: boolean
  horizontalStart: number
  horizontalEnd: number
  verticalStart: number
  verticalEnd: number
}

const horizontalAxisCount = ref(10)
const verticalAxisCount = ref(10)
/* const totalAxisItems = computed(
  () => horizontalAxisCount.value * verticalAxisCount.value,
) */
const subComponentPositions = ref<SubComponent[]>([])

const populatePlaceholders = () => {
  for (let x = 0; x < horizontalAxisCount.value; x++) {
    for (let y = 0; y < verticalAxisCount.value; y++) {
      subComponentPositions.value.push({
        name: 'BasicModularPlaceholderItem',
        hide: false,
        horizontalStart: x + 1,
        horizontalEnd: x + 2,
        verticalStart: y + 1,
        verticalEnd: y + 2,
      })
    }
  }
}
populatePlaceholders()
console.log(subComponentPositions.value)
const gridStyles = computed(() => ({
  gridTemplateColumns: `${'1fr '.repeat(horizontalAxisCount.value)}`,
  gridTemplateRows: `${'1fr '.repeat(verticalAxisCount.value)}`,
}))

function addComponent(data: {
  componentName: string
  horizontalAxisPos: number
  verticalAxisPos: number
}) {
  console.log('Helloooo')

  const placeholder = subComponentPositions.value.find(
    (placeholder) =>
      placeholder.name === 'BasicModularPlaceholderItem' &&
      placeholder.horizontalStart === data.horizontalAxisPos &&
      placeholder.verticalStart === data.verticalAxisPos,
  )
  if (placeholder) placeholder.hide = true
  console.log(data)
  subComponentPositions.value.push({
    name: data.componentName,
    hide: false,
    horizontalStart: data.horizontalAxisPos,
    horizontalEnd: data.horizontalAxisPos,
    verticalStart: data.verticalAxisPos,
    verticalEnd: data.verticalAxisPos,
  })
  console.log(subComponentPositions.value)
}

function getItemGridPosition(item: SubComponent) {
  console.log(
    'getItemGridPosition: ',
    `${item.horizontalStart} / ${item.horizontalEnd}`,
    `${item.verticalStart} / ${item.verticalEnd}`,
  )
  return {
    gridColumn: `${item.horizontalStart} / ${item.horizontalEnd}`,
    gridRow: `${item.verticalStart} / ${item.verticalEnd}`,
  }
}
</script>

<template>
  <div class="modular-component-grid" :style="gridStyles">
    <component
      :is="item.name"
      v-for="(item, index) in subComponentPositions.filter(
        (item) => !item.hide,
      )"
      :key="index"
      :horizontal-axis-pos="item.horizontalStart"
      :vertical-axis-pos="item.verticalStart"
      :style="getItemGridPosition(item)"
      @add-item="addComponent"
    >
    </component>
  </div>
</template>

<style scoped>
.modular-component-grid {
  height: 100%;
  width: 100%;
  display: grid;
  background-color: aliceblue;
}
</style>
