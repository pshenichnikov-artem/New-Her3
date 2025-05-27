import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { UserUpdateRequest } from '@/types/user/UserUpdateRequest'
import type { UserSearchRequest } from '@/types/user/UserSearchRequest'
import type { UserResponse } from '@/types/user/UserResponse'
import type { Response } from './useBaseApi'
import { reactive } from 'vue'
import { formatDateForServer } from '@/utils/formatterUtils'

/**
 * Composable для работы с API пользователей
 */
export function useUserApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<UserResponse>('users')

  /**
   * Функция для безопасного преобразования даты
   * Проверяет, валидна ли дата перед преобразованием
   */
  function safeFormatDate(dateString: string | null | undefined): string | null {
    if (!dateString) return null

    // Пытаемся создать объект даты и проверяем его валидность
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return null // Возвращаем null, если дата невалидна
    }

    return formatDateForServer(date)
  }

  /**
   * Поиск пользователей
   */
  async function searchUsersBase(
    request: UserSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<UserResponse> | null> {
    // Безопасное преобразование дат
    request.filter.birthDateFrom = safeFormatDate(request.filter.birthDateFrom)
    request.filter.birthDateTo = safeFormatDate(request.filter.birthDateTo)
    request.filter.createdAtFrom = safeFormatDate(request.filter.createdAtFrom)
    request.filter.createdAtTo = safeFormatDate(request.filter.createdAtTo)

    const response = await baseApi.makeRequest<Response<UserResponse>>(
      {
        method: 'POST',
        url: '/search',
        data: request,
      },
      'search',
      options,
    )

    return response?.data || null
  }

  /**
   * Поиск пользователей с поддержкой debounce
   */
  const searchUsers = baseApi.withDebounce(searchUsersBase, 300)

  /**
   * Получение пользователя по ID
   */
  async function getUserById(
    id: string,
    options: RequestOptions = {},
  ): Promise<UserResponse | null> {
    const response = await baseApi.makeRequest<UserResponse>(
      {
        method: 'GET',
        url: `/${id}`,
      },
      'get',
      options,
    )

    return response?.data || null
  }

  /**
   * Получение данных текущего пользователя
   */
  async function getCurrentUser(options: RequestOptions = {}): Promise<UserResponse | null> {
    const response = await baseApi.makeRequest<UserResponse>(
      {
        method: 'GET',
        url: `/me`,
      },
      'get',
      options,
    )

    return response?.data || null
  }

  /**
   * Обновление данных пользователя
   */
  async function updateUser(
    id: string,
    request: UserUpdateRequest,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('user.updateSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'PUT',
        url: `/${id}`,
        data: request,
      },
      'update',
      defaultOptions,
    )

    return response !== null
  }

  /**
   * Обновление данных текущего пользователя
   * @param request Запрос на обновление пользователя
   * @param options Опции запроса
   * @returns true если операция успешна, иначе false
   */
  async function updateUserBySelf(
    request: UserUpdateRequest,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('success.entities.user.profileUpdated'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'PUT',
        url: '/me',
        data: request,
      },
      'update',
      defaultOptions,
    )

    return response !== null
  }

  /**
   * Удаление пользователя
   */
  async function deleteUser(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('user.deleteSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'DELETE',
        url: `/${id}`,
      },
      'delete',
      defaultOptions,
    )

    return response !== null
  }

  // Создаем и возвращаем единый объект API для пользователей
  const userApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    user: baseApi.data,
    users: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    searchUsers,
    getUserById,
    getCurrentUser,
    updateUser,
    updateUserBySelf,
    deleteUser,
    resetState: baseApi.resetState,
  })

  return userApi
}
