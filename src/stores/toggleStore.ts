import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useToggleStore = defineStore('toggles', {
  state: () => ({
    addModularItemClicked: false,
    isResizing: false,
    isMoving: false,
  }),
  actions: {
    toggleModularItemClicked() {
      this.addModularItemClicked = !this.addModularItemClicked
    },
    toggleResizing() {
      console.log('toggle resizing')
      this.isResizing = !this.isResizing
    },
    toggleMoving() {
      console.log('toggle moving')
      this.isMoving = !this.isMoving
    },
  },
})
