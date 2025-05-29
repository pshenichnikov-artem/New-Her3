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
    request.filter.dateTo = safeFormatDate(request.filter.dateTo)
    request.filter.dateFrom = safeFormatDate(request.filter.dateFrom)

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
   * Обновление данных события (с поддержкой FormData для файлов)
   */
  async function updateEvent(
    id: string,
    request: EventAddRequest | FormData,
    options: RequestOptions = {},
  ): Promise<EventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('event.updateSuccess'),
      ...options,
    }

    let dataToSend: any = request
    let headers: any = {}

    // Если это не FormData, преобразуем EventUpdateRequest в FormData
    if (!(request instanceof FormData)) {
      dataToSend = new FormData()
      dataToSend.append('title', request.title)
      dataToSend.append('description', request.description)
      dataToSend.append('location', request.location)
      dataToSend.append('startDate', request.startDate)
      dataToSend.append('endDate', request.endDate)
      dataToSend.append('ticketCount', request.ticketCount)
      dataToSend.append('price', request.price)
      dataToSend.append('isActive', request.isActive ? 'true' : 'false')
      dataToSend.append('tag', request.tag)

      if (request.image.length !== request.localOrderRank.length) {
        throw new Error('Количество изображений и рангов должно совпадать')
      }

      for (let i = 0; i < request.image.length; i++) {
        dataToSend.append(`image`, request.image[i])
        dataToSend.append(`localOrderRank`, request.localOrderRank[i])
      }

      headers = { 'Content-Type': 'multipart/form-data' }
    }

    const response = await baseApi.makeRequest<EventResponse>(
      {
        method: 'PUT',
        url: `/${id}`,
        data: dataToSend,
        headers,
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
   * Создание события (с поддержкой FormData для файлов)
   */
  async function createEvent(
    request: EventAddRequest | FormData,
    options: RequestOptions = {},
  ): Promise<EventResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('event.createSuccess'),
      ...options,
    }

    let dataToSend: any = request
    let headers: any = {}

    // Если это не FormData, преобразуем EventAddRequest в FormData
    if (!(request instanceof FormData)) {
      dataToSend = new FormData()
      dataToSend.append('title', request.title)
      dataToSend.append('description', request.description)
      dataToSend.append('location', request.location)
      dataToSend.append('startDate', request.startDate)
      dataToSend.append('endDate', request.endDate)
      dataToSend.append('ticketCount', request.ticketCount.toString())
      dataToSend.append('tag', request.tag)

      if (request.image.length !== request.localOrderRank.length) {
        throw new Error('Количество изображений и рангов должно совпадать')
      }

      for (let i = 0; i < request.image.length; i++) {
        dataToSend.append(`image`, request.image[i])
        dataToSend.append(`localOrderRank`, request.localOrderRank[i])
      }
      headers = { 'Content-Type': 'multipart/form-data' }
    }

    const response = await baseApi.makeRequest<EventResponse>(
      {
        method: 'POST',
        url: '',
        data: dataToSend,
        headers,
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
