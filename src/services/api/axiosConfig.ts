import axios from 'axios'
import i18n from '@/i18n/i18n.ts'
import { useAuthStore } from '@/stores/auth'

axios.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.getToken

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Исправляем получение локали
    const lang = i18n.global.locale.value || 'ru' // Получаем текущий язык
    config.headers['Accept-Language'] = lang
    return config
  },
  (error) => Promise.reject(error),
)
