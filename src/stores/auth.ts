import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  token: string | null
  userRole: string | null
  isAuthenticated: boolean
}

const TOKEN_KEY = 'auth_token'
const USER_ROLE_KEY = 'user_role'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    userRole: localStorage.getItem(USER_ROLE_KEY),
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  }),

  getters: {
    getToken: (state) => state.token,
    getUserRole: (state) => state.userRole,
    getIsAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    setAuth(token: string, role: string) {
      this.token = token
      this.userRole = role
      this.isAuthenticated = true

      // Сохраняем в localStorage
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_ROLE_KEY, role)

      // Устанавливаем заголовок для axios
      this.setAuthHeader(token)
    },

    setAuthHeader(token: string | null) {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        delete axios.defaults.headers.common['Authorization']
      }
    },

    logout() {
      this.token = null
      this.userRole = null
      this.isAuthenticated = false

      // Удаляем из localStorage
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_ROLE_KEY)

      // Удаляем заголовок авторизации из axios
      delete axios.defaults.headers.common['Authorization']
    },

    // Инициализация состояния при загрузке приложения
    initializeAuth() {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        this.token = token
        this.userRole = localStorage.getItem(USER_ROLE_KEY)
        this.isAuthenticated = true
        this.setAuthHeader(token)
      }
    },
  },
})
