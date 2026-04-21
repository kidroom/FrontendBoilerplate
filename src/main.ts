import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-sonner/style.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { vAuth } from '@/directives/auth'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
useThemeStore(pinia).hydrate()
app.use(router)
app.directive('auth', vAuth)
app.mount('#app')
