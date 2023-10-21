import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import TestChildComponent from './components/TestChildComponent.vue'
import TestChildComponentSwitch from './components/TestChildComponentSwitch.vue'

const app = createApp(App)
app.component('TestChildComponent', TestChildComponent)
app.component('TestChildComponentSwitch', TestChildComponentSwitch)
app.mount('#app')
