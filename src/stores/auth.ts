import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const role = ref<string | null>(localStorage.getItem('user_role'))

  // Геттеры
  const isAuthenticated = computed(() => !!token.value)
  const getToken = computed(() => token.value)
  const isAdmin = computed(() => role.value?.toLowerCase() === 'admin')
  const isUser = computed(() => role.value?.toLowerCase() === 'user')
  console.log('isAdmin:', isAdmin.value, 'isUser:', isUser.value, 'role:', role.value)

  // Действия
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
    setAuthHeader(newToken)
  }

  function setRole(newRole: string) {
    role.value = newRole
    localStorage.setItem('user_role', newRole)
  }

  function clearToken() {
    token.value = null
    role.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    delete axios.defaults.headers.common['Authorization']
  }

  function setAuthHeader(token: string | null) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Инициализация состояния при загрузке приложения
  function initializeAuth() {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
      role.value = localStorage.getItem('user_role')
      setAuthHeader(savedToken)
    }
  }

  return {
    // Состояние
    token,
    role,

    // Геттеры
    isAuthenticated,
    getToken,
    isAdmin,
    isUser,

    // Действия
    setToken,
    setRole,
    clearToken,
    initializeAuth,
  }
})
