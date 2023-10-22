import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import TestChildComponent from './components/TestChildComponent.vue'
import TestChildComponentSwitch from './components/TestChildComponentSwitch.vue'
import { registerComponent } from './componentRegistry'

const app = createApp(App)
app.component('TestChildComponent', TestChildComponent)
registerComponent('TestChildComponent')
app.component('TestChildComponentSwitch', TestChildComponentSwitch)
registerComponent('TestChildComponentSwitch')
app.mount('#app')
