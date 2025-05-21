import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { AttendeeAddRequest } from '@/types/attendee/AttendeeAddRequest'
import type { AttendeeUpdateRequest } from '@/types/attendee/AttendeeUpdateRequest'
import type { AttendeeSearchRequest } from '@/types/attendee/AttendeeSearchRequest'
import type { AttendeeResponse } from '@/types/attendee/AttendeeResponse'
import type { Response } from './useBaseApi'
import { computed, reactive } from 'vue'

/**
 * Composable для работы с API участников мероприятий
 */
export function useAttendeeApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<AttendeeResponse>('attendees')

  /**
   * Получение участника по ID
   */
  async function getAttendeeById(
    id: string,
    options: RequestOptions = {},
  ): Promise<AttendeeResponse | null> {
    const response = await baseApi.makeRequest<AttendeeResponse>(
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
   * Поиск участников
   */
  async function searchAttendeesBase(
    request: AttendeeSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<AttendeeResponse> | null> {
    const response = await baseApi.makeRequest<Response<AttendeeResponse>>(
      {
        method: 'POST',
        url: `/search`,
        data: request,
      },
      'search',
      options,
    )

    return response?.data || null
  }

  /**
   * Поиск участников с поддержкой debounce
   */
  const searchAttendees = baseApi.withDebounce(searchAttendeesBase, 300)

  /**
   * Обновление данных участника
   */
  async function updateAttendee(
    id: string,
    request: AttendeeUpdateRequest,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('attendee.updateSuccess'),
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
   * Удаление участника
   */
  async function deleteAttendee(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('attendee.deleteSuccess'),
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

  /**
   * Создание участника
   */
  async function createAttendee(
    request: AttendeeAddRequest,
    options: RequestOptions = {},
  ): Promise<AttendeeResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('attendee.createSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<AttendeeResponse>(
      {
        method: 'POST',
        url: '',
        data: request,
      },
      'create',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Создание собственного участника
   */
  async function createAttendeeSelf(
    request: AttendeeAddRequest,
    options: RequestOptions = {},
  ): Promise<AttendeeResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('attendee.createSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<AttendeeResponse>(
      {
        method: 'POST',
        url: `/me`,
        data: request,
      },
      'create',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Поиск собственных участников
   */
  async function getMyAttendees(
    request: AttendeeSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<AttendeeResponse> | null> {
    const response = await baseApi.makeRequest<Response<AttendeeResponse>>(
      {
        method: 'POST',
        url: `/me/search`,
        data: request,
      },
      'search',
      options,
    )

    return response?.data || null
  }

  // Создаем и возвращаем единый объект API для участников
  const attendeeApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    attendee: baseApi.data,
    attendees: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    getAttendeeById,
    searchAttendees,
    updateAttendee,
    deleteAttendee,
    createAttendee,
    createAttendeeSelf,
    getMyAttendees,
    resetState: baseApi.resetState,
  })

  return attendeeApi
}
