import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { LoginRequest } from '@/types/auth/LoginRequest'
import type { LoginResponse } from '@/types/auth/LoginResponse'
import type { RegisterRequest } from '@/types/auth/RegisterRequest'
import type { ChangePasswordRequest } from '@/types/auth/ChangePasswordRequest'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable для работы с API аутентификации
 */
export function useAuthApi() {
  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()

  // Используем базовый API composable
  const baseApi = useBaseApi<any>('auth')

  /**
   * Вход в систему
   */
  async function login(
    request: LoginRequest,
    options: RequestOptions = {},
  ): Promise<LoginResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('common.success.loginSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<LoginResponse>(
      {
        method: 'POST',
        url: '/login',
        data: request,
      },
      'login',
      {
        ...defaultOptions,
        onSuccess: (data) => {
          // Сохраняем токен после успешной авторизации
          if (data && data.token) {
            authStore.setToken(data.token)
            authStore.setRole(data.role)

            // Перенаправляем на главную страницу после успешного входа
            if (!options.onSuccess) {
              router.push('/')
            }
          }

          if (defaultOptions.onSuccess) {
            defaultOptions.onSuccess(data)
          }
        },
      },
    )

    return response?.data || null
  }

  /**
   * Регистрация нового пользователя
   */
  async function register(
    request: RegisterRequest,
    options: RequestOptions = {},
  ): Promise<LoginResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('common.success.registerSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<LoginResponse>(
      {
        method: 'POST',
        url: '/register',
        data: request,
      },
      'register',
      {
        ...defaultOptions,
        onSuccess: (data) => {
          // Сохраняем токен после успешной регистрации
          if (data && data.token) {
            authStore.setToken(data.token)
            authStore.setRole(data.role)

            // Перенаправляем на главную страницу после успешной регистрации
            if (!options.onSuccess) {
              router.push('/')
            }
          }

          if (defaultOptions.onSuccess) {
            defaultOptions.onSuccess(data)
          }
        },
      },
    )

    return response?.data || null
  }

  /**
   * Изменение пароля текущего пользователя
   */
  async function changePassword(
    request: ChangePasswordRequest,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('auth.passwordChanged'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'PUT',
        url: '/change-password',
        data: request,
      },
      'changePassword',
      defaultOptions,
    )

    return response !== null
  }

  /**
   * Выход из системы (локальный)
   */
  function logout(): void {
    // Удаляем токен из хранилища
    authStore.clearToken()

    // Перенаправляем на страницу входа
    router.push('/login')
  }

  /**
   * Проверка статуса авторизации
   */
  function isAuthenticated(): boolean {
    return authStore.isAuthenticated
  }

  /**
   * Получение текущей роли пользователя
   */
  function getUserRole(): string | null {
    return authStore.role
  }

  // Создаем и возвращаем единый объект API для аутентификации
  const authApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    error: baseApi.error,

    // Методы
    login,
    register,
    changePassword,
    logout,
    isAuthenticated,
    getUserRole,
  })

  return authApi
}
