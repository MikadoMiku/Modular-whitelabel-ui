<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToggleStore } from '../stores/toggleStore'
import BasicModularPlaceholderItem from './BasicModularPlaceholderItem.vue'
import BasicResizableComponentWrapper from './BasicResizableComponentWrapper.vue'
import { useModularityStore } from '../stores/modularityStore'
/* Adding an element to this modular component creates a proxy of it in this code? Meaning that we never actually move the reference of the element around? We alter the position in which the grid shows it in */

interface SubComponent {
  id: string
  name: string
  hide: boolean
  horizontalStart: number
  horizontalEnd: number
  verticalStart: number
  verticalEnd: number
  color?: '#008000' | '#DC143C'
}

const isResizingSubComponent = computed(() => useToggleStore().isResizing)
const resizingComponentId = computed(
  () => useModularityStore().resizingComponentId,
)
watch(isResizingSubComponent, (newValue) => {
  if (!newValue) {
    placeholderPositions.value.forEach((ph) => (ph.color = undefined))
  }
})
const isResizeError = ref(false)
const horizontalAxisCount = ref(10)
const verticalAxisCount = ref(10)
/* const totalAxisItems = computed(
  () => horizontalAxisCount.value * verticalAxisCount.value,
) */
const subComponentPositions = ref<SubComponent[]>([])

const placeholderPositions = ref<SubComponent[]>([])

const populatePlaceholders = () => {
  for (let x = 1; x <= horizontalAxisCount.value; x++) {
    for (let y = 1; y <= verticalAxisCount.value; y++) {
      placeholderPositions.value.push({
        id: `placeholder-x${x}y${y}`,
        name: 'BasicModularPlaceholderItem',
        hide: false,
        horizontalStart: x,
        horizontalEnd: x + 1,
        verticalStart: y,
        verticalEnd: y + 1,
      })
    }
  }
}
populatePlaceholders()
const gridStyles = computed(() => ({
  gridTemplateColumns: `${'1fr '.repeat(horizontalAxisCount.value)}`,
  gridTemplateRows: `${'1fr '.repeat(verticalAxisCount.value)}`,
}))

function addComponent(data: {
  componentName: string
  horizontalAxisPos: number
  verticalAxisPos: number
}) {
  useToggleStore().toggleModularItemClicked()
  const placeholder = placeholderPositions.value.find(
    (placeholder) =>
      placeholder.name === 'BasicModularPlaceholderItem' &&
      placeholder.horizontalStart === data.horizontalAxisPos &&
      placeholder.verticalStart === data.verticalAxisPos,
  )
  if (placeholder) placeholder.hide = true
  subComponentPositions.value.push({
    id: `subcomponent-x${data.horizontalAxisPos}y${data.verticalAxisPos}`,
    name: data.componentName,
    hide: false,
    horizontalStart: data.horizontalAxisPos,
    horizontalEnd: data.horizontalAxisPos,
    verticalStart: data.verticalAxisPos,
    verticalEnd: data.verticalAxisPos,
  })
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

function handleMouseOver(item: SubComponent) {
  if (isResizingSubComponent.value) {
    // Your logic here, like getting the x, y of the hovered element
    console.log(
      'Mouse over - X: ',
      item.horizontalStart,
      'Mouse over - Y: ',
      item.verticalStart,
    )
    // Go over all subcomponents and check if any of them are between starting position
    const resizingComponent = subComponentPositions.value.find(
      (sc) => sc.id === resizingComponentId.value,
    )
    for (let x = 1; x <= item.horizontalStart; x++) {
      for (let y = 1; y <= item.verticalStart; y++) {
        const si = subComponentPositions.value.find(
          (si) =>
            si.id !== resizingComponentId.value &&
            si.horizontalStart >= resizingComponent!.horizontalStart && // x3 >= x1, true
            si.horizontalStart <= item.horizontalStart && // x3 <= x3, true
            si.verticalStart >= resizingComponent!.verticalStart && // y3 >= y1, true
            si.verticalStart <= item.verticalStart, // y3 <= y2, false
        )
        if (si) {
          isResizeError.value = true
        } else {
          isResizeError.value = false
        }
      }
    }

    for (let x = 1; x <= item.horizontalStart; x++) {
      for (let y = 1; y <= item.verticalStart; y++) {
        const ph = placeholderPositions.value.find(
          (ph) => ph.horizontalStart === x && ph.verticalStart === y,
        )
        if (ph) {
          if (isResizeError.value) {
            ph.color = '#DC143C'
          } else {
            ph.color = '#008000'
          }
        }
      }
    }
  }
}

function handleMouseLeave() {
  if (isResizingSubComponent.value) {
    placeholderPositions.value.forEach((ph) => (ph.color = undefined))
  }
}
</script>

<template>
  <div class="modular-component-grid" :style="gridStyles">
    <BasicModularPlaceholderItem
      v-for="item in placeholderPositions.filter((item) => !item.hide)"
      :id="item.id"
      :key="item.id"
      :horizontal-axis-pos="item.horizontalStart"
      :vertical-axis-pos="item.verticalStart"
      :style="getItemGridPosition(item)"
      :color="item.color"
      @add-item="addComponent"
      @mouseover="handleMouseOver(item)"
      @mouseleave="handleMouseLeave()"
    >
    </BasicModularPlaceholderItem>
    <BasicResizableComponentWrapper
      v-for="item in subComponentPositions"
      :id="item.id"
      :key="item.id"
      :horizontal-axis-pos="item.horizontalStart"
      :vertical-axis-pos="item.verticalStart"
      :style="getItemGridPosition(item)"
      :component-name="item.name"
      @mouseover="handleMouseOver(item)"
      @mouseleave="handleMouseLeave()"
    >
    </BasicResizableComponentWrapper>
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
