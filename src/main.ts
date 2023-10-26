import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import TestChildComponent from './components/TestChildComponent.vue'
import TestChildComponentSwitch from './components/TestChildComponentSwitch.vue'
import { registerComponent } from './componentRegistry'

const pinia = createPinia()
const app = createApp(App)
app.component('TestChildComponent', TestChildComponent)
registerComponent({
  logicalName: 'TestChildComponent',
  userViewableName: 'Digital clock',
})
app.component('TestChildComponentSwitch', TestChildComponentSwitch)
registerComponent({
  logicalName: 'TestChildComponentSwitch',
  userViewableName: 'User greeting',
})
app.use(pinia)
app.mount('#app')
