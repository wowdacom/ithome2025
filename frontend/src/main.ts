import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化認證狀態
import { useAuthStore } from './stores/authStore'
const authStore = useAuthStore()
authStore.initialize()
authStore.setupAuthListener()

app.mount('#app')
