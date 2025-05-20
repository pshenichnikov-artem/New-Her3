import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'
import '@/services/api/axiosConfig'
import i18n from '@/i18n/i18n'
import { createPinia } from 'pinia'
import notification from './plugins/notification'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Инициализируем состояние авторизации
const authStore = useAuthStore()
authStore.initializeAuth()

// Используем плагины
app.use(router)
app.use(i18n)
app.use(notification)

// Монтируем приложение
app.mount('#app')
