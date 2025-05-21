import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { EventAddRequest } from '@/types/event/EventAddRequest'
import type { EventUpdateRequest } from '@/types/event/EventUpdateRequest'
import type { EventSearchRequest } from '@/types/event/EventSearchRequest'
import type { EventResponse } from '@/types/event/EventResponse'
import type { Response } from './useBaseApi'
import { reactive } from 'vue'
import { formatDateForServer } from '@/utils/formatterUtils'

/**
 * Composable для работы с API событий
 */
export function useEventApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<EventResponse>('events')

  /**
   * Получение события по ID
   */
  async function getEventById(
    id: string,
    options: RequestOptions = {},
  ): Promise<EventResponse | null> {
    const response = await baseApi.makeRequest<EventResponse>(
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
   * Поиск событий
   */
  async function searchEventsBase(
    request: EventSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<EventResponse> | null> {
    request.filter.dateTo = request.filter.dateTo
      ? formatDateForServer(new Date(request.filter.dateTo))
      : null
    request.filter.dateFrom = request.filter.dateFrom
      ? formatDateForServer(new Date(request.filter.dateFrom))
      : null

    const response = await baseApi.makeRequest<Response<EventResponse>>(
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
   * Поиск событий с поддержкой debounce
   */
  const searchEvents = baseApi.withDebounce(searchEventsBase, 300)

  /**
   * Обновление данных события
   */
  async function updateEvent(
    id: string,
    request: EventUpdateRequest,
    options: RequestOptions = {},
  ): Promise<EventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('event.updateSuccess'),
      ...options,
    }

    request.startDate = request.startDate
      ? formatDateForServer(new Date(request.startDate))
      : request.startDate
    request.endDate = request.endDate
      ? formatDateForServer(new Date(request.endDate))
      : request.startDate

    const response = await baseApi.makeRequest<EventResponse>(
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
   * Удаление события
   */
  async function deleteEvent(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('event.deleteSuccess'),
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
   * Создание события
   */
  async function createEvent(
    request: EventAddRequest,
    options: RequestOptions = {},
  ): Promise<EventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('event.createSuccess'),
      ...options,
    }

    request.startDate = request.startDate
      ? formatDateForServer(new Date(request.startDate))
      : request.startDate
    request.endDate = request.endDate
      ? formatDateForServer(new Date(request.endDate))
      : request.startDate

    const response = await baseApi.makeRequest<EventResponse>(
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

  // Создаем и возвращаем единый объект API для событий
  const eventApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    event: baseApi.data,
    events: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    getEventById,
    searchEvents,
    updateEvent,
    deleteEvent,
    createEvent,
    resetState: baseApi.resetState,
  })

  return eventApi
}
