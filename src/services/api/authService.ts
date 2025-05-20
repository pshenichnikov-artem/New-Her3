import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { LoginRequest } from '@/types/auth/LoginRequest'
import type { RegisterRequest } from '@/types/auth/RegisterRequest'
import type { LoginResponse } from '@/types/auth/LoginResponse'
import { createDefaultErrorResponse } from '@/utils/createDefaultErrorResponse'
import { useAuthStore } from '@/stores/auth'

const authService = {
  async login(userData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    console.log(userData)
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}/v1/auth/sign-in`,
        userData,
      )

      if (response.data.status === 'success' && response.data.data?.token) {
        const authStore = useAuthStore()
        authStore.setAuth(response.data.data.token, response.data.data.role)
      }

      return response.data
    } catch (error: any) {
      return error.response?.data || createDefaultErrorResponse<LoginResponse>()
    }
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}/v1/auth/sign-up`,
        userData,
      )

      if (response.data.status === 'success' && response.data.data?.token) {
        const authStore = useAuthStore()
        authStore.setAuth(response.data.data.token, response.data.data.role)
      }

      return response.data
    } catch (error: any) {
      return error.response?.data || createDefaultErrorResponse<LoginResponse>()
    }
  },

  async checkStatus(): Promise<ApiResponse<null>> {
    try {
      const response = await axios.get<ApiResponse<null>>(`${API_BASE_URL}/v1/auth/status`)
      return response.data
    } catch (error: any) {
      return error.response?.data || createDefaultErrorResponse<null>()
    }
  },

  logout(): void {
    const authStore = useAuthStore()
    authStore.logout()
  },

  getUserRole(): string | null {
    const authStore = useAuthStore()
    return authStore.getUserRole
  },

  isAuthenticated(): boolean {
    const authStore = useAuthStore()
    return authStore.getIsAuthenticated
  },
}

export default authService
