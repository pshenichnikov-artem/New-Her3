import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { readonly } from 'vue'
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { notificationService } from '@/composables/useNotification'
import { API_BASE_URL } from '@/constants/api'
import type { ApiResponse } from '@/types/ApiResponse'

// Интерфейс для опций запросов
export interface RequestOptions {
  showSuccessNotification?: boolean
  showErrorNotification?: boolean
  successMessage?: string
  errorMessage?: string
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onFinally?: () => void
  debounceDelay?: number
}

// Структура для хранения состояния загрузки
export interface LoadingState {
  [key: string]: boolean
}

// Интерфейс для пагинированного ответа
export interface Response<T> {
  items: T[]
  totalCount: number
  pageSize: number
  pageNumber: number
}

/**
 * Базовый composable для работы с API
 * @param endpoint Базовый эндпоинт API (например, 'attendees')
 * @param loadingKeys Ключи для состояний загрузки
 */
export function useBaseApi<T>(
  endpoint: string,
  loadingKeys: string[] = ['get', 'search', 'create', 'update', 'delete'],
) {
  const { t } = useI18n()
  const baseUrl = `${API_BASE_URL}/${endpoint}`

  // Инициализация состояния загрузки с указанными ключами
  const loading = reactive<LoadingState>(
    loadingKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
  )

  // Вычисляемое свойство, показывающее любую загрузку
  const isLoading = computed(() => Object.values(loading).some((state) => state))

  // Общие состояния
  const error = ref<any>(null)
  const data = ref<T | null>(null)
  const items = ref<T[]>([])
  const totalCount = ref<number>(0)

  /**
   * Общий метод для выполнения запроса к API
   */
  async function makeRequest<R>(
    config: AxiosRequestConfig,
    loadingKey: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<R> | null> {
    const {
      showSuccessNotification = false,
      showErrorNotification = true,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      onFinally,
    } = options

    // Устанавливаем состояние загрузки
    if (loadingKey in loading) {
      loading[loadingKey] = true
    }
    error.value = null

    try {
      const response = await axios.request<ApiResponse<R>>({
        ...config,
        url: config.url?.startsWith('http') ? config.url : `${baseUrl}${config.url || ''}`,
      })

      const responseData = response.data

      // Обработка успешного ответа
      if (responseData.status === 'success') {
        // Если данные содержат пагинированный ответ, обновляем items и totalCount
        if (
          responseData.data &&
          typeof responseData.data === 'object' &&
          'items' in responseData.data &&
          'totalCount' in responseData.data
        ) {
          items.value = (responseData.data.items as T[]) || []

          if (typeof responseData.data.totalCount === 'number') {
            totalCount.value = responseData.data.totalCount || 0
          } else {
            // Если totalCount не число, преобразуем его или устанавливаем 0
            totalCount.value = parseInt(String(responseData.data.totalCount), 10) || 0
          }
        } else if (responseData.data && Array.isArray(responseData.data)) {
          items.value = responseData.data as T[]
          totalCount.value = responseData.data.length
        } else if (responseData.data) {
          data.value = responseData.data as T
        }

        if (responseData.data && showSuccessNotification) {
          notificationService.success(successMessage || t('common.success.operationSuccess'))
        }

        if (onSuccess) {
          onSuccess(responseData.data)
        }

        // Важное изменение: вызываем onFinally при успехе
        if (onFinally) {
          onFinally()
        }

        return responseData
      }
      // Обработка ошибки в ответе
      else {
        error.value = responseData.error || { message: responseData.message }

        if (showErrorNotification) {
          notificationService.error(
            errorMessage || responseData.message || t('common.errors.operationFailed'),
          )
        }

        if (onError) {
          onError(error.value)
        }

        // Важное изменение: вызываем onFinally при ошибке
        if (onFinally) {
          onFinally()
        }

        return responseData
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<any>>
      console.log('API Error:', axiosError)

      // Проверяем ошибку сети - используем code вместо message
      if (axiosError.code === 'ERR_NETWORK') {
        error.value = {
          code: 0,
          message: t('common.errors.networkError'),
        }

        if (showErrorNotification) {
          notificationService.error(errorMessage || t('common.errors.networkError'))
        }
      } else {
        // Обработка других ошибок, как раньше
        error.value = axiosError.response?.data?.error || {
          code: axiosError.response?.status || 500,
          message: axiosError.message,
        }

        if (showErrorNotification) {
          const errorMsg =
            axiosError.response?.data?.message ||
            axiosError.message ||
            errorMessage ||
            t('common.errors.unexpected')
          notificationService.error(errorMsg)
        }
      }

      if (onError) {
        onError(error.value)
      }

      // Важное изменение: вызываем onFinally при исключении
      if (onFinally) {
        onFinally()
      }

      return null
    } finally {
      if (loadingKey in loading) {
        loading[loadingKey] = false
      }

      // Удалено: больше не вызываем onFinally здесь, так как теперь вызываем в каждой ветке
    }
  }

  /**
   * Создает функцию с debounce
   * @param fn Функция, которую нужно обернуть в debounce
   * @param delay Задержка в миллисекундах
   */
  function withDebounce<F extends (...args: any[]) => Promise<any>>(fn: F, delay: number): F {
    let timeout: ReturnType<typeof setTimeout> | null = null

    const debouncedFn = async function (...args: any[]): Promise<any> {
      return new Promise((resolve) => {
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          resolve(fn(...args))
          timeout = null
        }, delay)
      })
    } as F

    return debouncedFn
  }

  /**
   * Сброс состояния
   */
  function resetState(): void {
    data.value = null
    items.value = []
    totalCount.value = 0
    error.value = null
  }

  return {
    // Базовый URL
    baseUrl,

    // Состояния
    loading: readonly(loading),
    isLoading,
    error,
    data,
    items,
    totalCount,

    // Методы
    makeRequest,
    withDebounce,
    resetState,
  }
}
