import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import TestChildComponent from './components/TestChildComponent.vue'
import TestChildComponentSwitch from './components/TestChildComponentSwitch.vue'
import BasicModularPlaceholderItem from './components/BasicModularPlaceholderItem.vue'
import { registerComponent } from './componentRegistry'

const pinia = createPinia()
const app = createApp(App)
app.component('BasicModularPlaceholderItem', BasicModularPlaceholderItem)
registerComponent('BasicModularPlaceholderItem')
app.component('TestChildComponent', TestChildComponent)
registerComponent('TestChildComponent')
app.component('TestChildComponentSwitch', TestChildComponentSwitch)
registerComponent('TestChildComponentSwitch')
app.use(pinia)
app.mount('#app')
