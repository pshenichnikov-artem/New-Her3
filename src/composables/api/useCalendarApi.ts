import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { UserCalendarAddEventRequest } from '@/types/calendar/UserCalendarAddEventRequest'
import type { UserCalendarUpdateEventRequest } from '@/types/calendar/UserCalendarUpdateEventRequest'
import type { UserCalendarResponse } from '@/types/calendar/UserCalendarResponse'
import type { UserCalendarEventResponse } from '@/types/calendar/UserCalendarEventResponse'
import { reactive } from 'vue'

/**
 * Composable для работы с API календаря пользователя
 */
export function useCalendarApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<UserCalendarResponse>('calendar')

  /**
   * Получение календаря текущего пользователя
   */
  async function getMyCalendar(options: RequestOptions = {}): Promise<UserCalendarResponse | null> {
    const response = await baseApi.makeRequest<UserCalendarResponse>(
      {
        method: 'GET',
        url: '/me',
      },
      'get',
      options,
    )

    return response?.data || null
  }

  /**
   * Добавление события в календарь пользователя по ID
   */
  async function addUserEvent(
    userId: string,
    request: UserCalendarAddEventRequest,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventAddSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'POST',
        url: `/user/${userId}`,
        data: request,
      },
      'create',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Добавление события в календарь текущего пользователя
   */
  async function addMyEvent(
    request: UserCalendarAddEventRequest,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventAddSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'POST',
        url: '/me',
        data: request,
      },
      'create',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Удаление события из календаря (админ)
   */
  async function deleteUserEvent(
    id: string,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventDeleteSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'DELETE',
        url: `/${id}`,
      },
      'delete',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Удаление события из календаря текущего пользователя
   */
  async function deleteMyEvent(
    id: string,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventDeleteSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'DELETE',
        url: `/me/${id}`,
      },
      'delete',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Обновление события в календаре
   */
  async function updateUserEvent(
    id: string,
    request: UserCalendarUpdateEventRequest,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventUpdateSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'PUT',
        url: `/${id}`,
        data: request,
      },
      'update',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Обновление события в календаре текущего пользователя
   */
  async function updateMyEvent(
    id: string,
    request: UserCalendarUpdateEventRequest,
    options: RequestOptions = {},
  ): Promise<UserCalendarEventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('calendar.eventUpdateSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<UserCalendarEventResponse>(
      {
        method: 'PUT',
        url: `/me/${id}`,
        data: request,
      },
      'update',
      defaultOptions,
    )

    return response?.data || null
  }

  // Создаем и возвращаем единый реактивный объект API для календаря
  const calendarApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    calendar: baseApi.data,
    error: baseApi.error,

    // Методы
    getMyCalendar,
    addUserEvent,
    addMyEvent,
    deleteUserEvent,
    deleteMyEvent,
    updateUserEvent,
    updateMyEvent,
    resetState: baseApi.resetState,
  })

  return calendarApi
}
