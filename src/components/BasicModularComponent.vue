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
  coveredById?: string
}

const isResizingSubComponent = computed(() => useToggleStore().isResizing)
const isMovingSubComponent = computed(() => useToggleStore().isMoving)
const resizingComponentId = computed(
  () => useModularityStore().resizingComponentId,
)
const movingComponentId = computed(() => useModularityStore().movingComponentId)

const isResizeError = ref(false)
const horizontalAxisCount = ref(10)
const verticalAxisCount = ref(10)
/* const totalAxisItems = computed(
  () => horizontalAxisCount.value * verticalAxisCount.value,
) */
const subComponentPositions = ref<SubComponent[]>([])

const placeholderPositions = ref<SubComponent[]>([])

watch(isResizingSubComponent, (newValue) => {
  if (!newValue) {
    placeholderPositions.value.forEach((ph) => {
      ph.color = undefined
      ph.hide = ph.coveredById ? true : false
    })
  } else {
    placeholderPositions.value.forEach((ph) => (ph.hide = false))
  }
})

watch(isMovingSubComponent, (newValue) => {
  if (!newValue) {
    placeholderPositions.value.forEach((ph) => {
      ph.color = undefined
      ph.hide = ph.coveredById ? true : false
    })
  } else {
    placeholderPositions.value.forEach((ph) => (ph.hide = false))
  }
})

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
  return {
    gridColumn: `${item.horizontalStart} / ${item.horizontalEnd}`,
    gridRow: `${item.verticalStart} / ${item.verticalEnd}`,
  }
}

function resizingValidation(item: SubComponent) {
  // Your logic here, like getting the x, y of the hovered element
  // Go over all subcomponents and check if any of them are between starting position
  const resizingComponent = subComponentPositions.value.find(
    (sc) => sc.id === resizingComponentId.value,
  )
  for (
    let x = resizingComponent!.horizontalStart;
    x <= item.horizontalStart;
    x++
  ) {
    for (
      let y = resizingComponent!.verticalStart;
      y <= item.verticalStart;
      y++
    ) {
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
        useModularityStore().setResizePlaceholderId(item.id)
      }
    }
  }

  for (
    let x = resizingComponent!.horizontalStart;
    x <= item.horizontalStart;
    x++
  ) {
    for (
      let y = resizingComponent!.verticalStart;
      y <= item.verticalStart;
      y++
    ) {
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

function movingValidation(item: SubComponent) {
  const movingComponent = subComponentPositions.value.find(
    (sc) => sc.id === movingComponentId.value,
  )
  if (movingComponent == undefined) return
  // movingComponent gets us the delta from top left <---> bottom right for x and y
  // Component starting points are always top left and x and y increase going left to right and top to bottom. This is why you have to subtract X(0) from X(n) etc
  let xDelta =
    movingComponent.horizontalEnd - movingComponent.horizontalStart - 1
  xDelta = xDelta < 0 ? 0 : xDelta
  let yDelta = movingComponent.verticalEnd - movingComponent.verticalStart - 1
  yDelta = yDelta < 0 ? 0 : yDelta
  console.log('validating xDelta: ', xDelta)
  console.log('validating yDelta: ', yDelta)
  // Using deltas you can recreate the original component area
  const newHorizontalAxisStart = item.horizontalStart
  const newVerticalAxisStart = item.verticalStart
  const newHorizontalAxisEnd = item.horizontalStart + xDelta
  const newVerticalAxisEnd = item.verticalStart + yDelta
  // Check if there are any components in the recreated area
  console.log(
    `Cheking area of: X(0) = ${newHorizontalAxisStart} || X(1) = ${newHorizontalAxisEnd}`,
  )
  console.log(
    `Cheking area of: Y(0) = ${newVerticalAxisStart} || Y(1) = ${newVerticalAxisEnd}`,
  )
  const overlappingComponent = subComponentPositions.value.find(
    (si) =>
      si.id !== movingComponentId.value &&
      !(
        newHorizontalAxisStart >= si.horizontalEnd ||
        newHorizontalAxisEnd <= si.horizontalStart ||
        newVerticalAxisStart >= si.verticalEnd ||
        newVerticalAxisEnd <= si.verticalStart
      ),
  )

  if (overlappingComponent) {
    isResizeError.value = true
  } else {
    isResizeError.value = false
    useModularityStore().setMovingPlaceholderId(item.id)
  }

  for (let x = newHorizontalAxisStart; x <= newHorizontalAxisEnd; x++) {
    for (let y = newVerticalAxisStart; y <= newVerticalAxisEnd; y++) {
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

function handleMouseOver(item: SubComponent) {
  if (isResizingSubComponent.value) {
    resizingValidation(item)
  } else if (isMovingSubComponent.value) {
    console.log(item.horizontalStart, item.verticalStart)
    movingValidation(item)
  }
}

function handleMouseLeave() {
  if (isResizingSubComponent.value) {
    placeholderPositions.value.forEach((ph) => (ph.color = undefined))
  } else if (isMovingSubComponent.value) {
    placeholderPositions.value.forEach((ph) => (ph.color = undefined))
  }
}

function resizeSubComponent(subComponentId: string) {
  const resizePoint = placeholderPositions.value.find(
    (ph) => ph.id === useModularityStore().resizePlaceholderId,
  )
  const resizableComponent = subComponentPositions.value.find(
    (sc) => sc.id === subComponentId,
  )

  if (resizableComponent && resizePoint) {
    resizableComponent.horizontalEnd = resizePoint.horizontalEnd
    resizableComponent.verticalEnd = resizePoint.verticalEnd

    placeholderPositions.value.forEach((ph) => {
      // Check if the placeholder is within the bounds of the resizable component
      const isWithinBounds =
        ph.horizontalStart >= resizableComponent.horizontalStart &&
        ph.horizontalStart < resizableComponent.horizontalEnd &&
        ph.verticalStart >= resizableComponent.verticalStart &&
        ph.verticalStart < resizableComponent.verticalEnd

      if (isWithinBounds) {
        ph.hide = true
        ph.coveredById = subComponentId
      } else if (ph.coveredById === subComponentId) {
        // This means the placeholder was previously covered by the current component but not anymore
        ph.hide = false
        ph.coveredById = undefined
      }
      // For other placeholders not affected by the current component, do nothing
    })
  }
}

function moveSubComponent(subComponentId: string) {
  const movingPoint = placeholderPositions.value.find(
    (ph) => ph.id === useModularityStore().movingPlaceholderId,
  )
  const movingComponent = subComponentPositions.value.find(
    (sc) => sc.id === subComponentId,
  )
  if (movingComponent == undefined || movingPoint == undefined) return
  console.log('moving compoonent')
  // movingComponent gets us the delta from top left <---> bottom right for x and y
  // Component starting points are always top left and x and y increase going left to right and top to bottom. This is why you have to subtract X(0) from X(n) etc
  const xDelta = movingComponent.horizontalEnd - movingComponent.horizontalStart
  const yDelta = movingComponent.verticalEnd - movingComponent.verticalStart
  console.log('placing xDelta: ', xDelta)
  console.log('placing yDelta: ', yDelta)
  // Using deltas you can recreate the original component area
  const newHorizontalAxisStart = movingPoint.horizontalStart
  const newVerticalAxisStart = movingPoint.verticalStart
  const newHorizontalAxisEnd = movingPoint.horizontalStart + xDelta
  const newVerticalAxisEnd = movingPoint.verticalStart + yDelta
  movingComponent.horizontalStart = newHorizontalAxisStart
  movingComponent.horizontalEnd = newHorizontalAxisEnd
  movingComponent.verticalStart = newVerticalAxisStart
  movingComponent.verticalEnd = newVerticalAxisEnd

  placeholderPositions.value.forEach((ph) => {
    // Check if the placeholder is within the bounds of the resizable component
    const isWithinBounds =
      ph.horizontalStart >= movingComponent.horizontalStart &&
      ph.horizontalStart < movingComponent.horizontalEnd &&
      ph.verticalStart >= movingComponent.verticalStart &&
      ph.verticalStart < movingComponent.verticalEnd

    if (isWithinBounds) {
      ph.hide = true
      ph.coveredById = subComponentId
    } else if (ph.coveredById === subComponentId) {
      // This means the placeholder was previously covered by the current component but not anymore
      ph.hide = false
      ph.coveredById = undefined
    }
    // For other placeholders not affected by the current component, do nothing
  })
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
      @resize-component="resizeSubComponent"
      @move-component="moveSubComponent"
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
