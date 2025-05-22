import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { TicketAddRequest } from '@/types/ticket/TicketAddRequest'
import type { TicketUpdateRequest } from '@/types/ticket/TicketUpdateRequest'
import type { TicketSearchRequest } from '@/types/ticket/TicketSearchRequest'
import type { TicketResponse } from '@/types/ticket/TicketResponse'
import type { Response } from './useBaseApi'
import { reactive } from 'vue'

/**
 * Composable для работы с API билетов
 */
export function useTicketApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<TicketResponse>('tickets')

  /**
   * Получение билета по ID
   */
  async function getTicketById(
    id: string,
    options: RequestOptions = {},
  ): Promise<TicketResponse | null> {
    const response = await baseApi.makeRequest<TicketResponse>(
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
   * Получение билетов текущего пользователя
   */
  async function getMyTickets(
    request: TicketSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<TicketResponse> | null> {
    const response = await baseApi.makeRequest<Response<TicketResponse>>(
      {
        method: 'POST',
        url: `/me`,
        data: request,
      },
      'search',
      options,
    )

    return response?.data || null
  }

  /**
   * Поиск билетов
   */
  async function searchTicketsBase(
    request: TicketSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<TicketResponse> | null> {
    const response = await baseApi.makeRequest<Response<TicketResponse>>(
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
   * Поиск билетов с поддержкой debounce
   */
  const searchTickets = baseApi.withDebounce(searchTicketsBase, 300)

  /**
   * Добавление билета
   */
  async function addTicket(
    request: TicketAddRequest,
    options: RequestOptions = {},
  ): Promise<TicketResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('ticket.createSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<TicketResponse>(
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
   * Обновление билета
   */
  async function updateTicket(
    id: string,
    request: TicketUpdateRequest,
    options: RequestOptions = {},
  ): Promise<TicketResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('ticket.updateSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<TicketResponse>(
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
   * Удаление билета
   */
  async function deleteTicket(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('ticket.deleteSuccess'),
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
   * Резервирование билета на мероприятие
   * @param eventId ID мероприятия
   * @param options Опции запроса
   * @returns Строка с ключом резервирования или null
   */
  async function reserveTicket(
    eventId: string,
    options: RequestOptions = {},
  ): Promise<string | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('ticket.reserveSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<string>(
      {
        method: 'POST',
        url: `/reserve/${eventId}`,
      },
      'update',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Получение количества доступных билетов на мероприятие
   * @param eventId ID мероприятия
   * @param options Опции запроса
   * @returns Количество доступных билетов или null
   */
  async function getAvailableTicketsCount(
    eventId: string,
    options: RequestOptions = {},
  ): Promise<number | null> {
    const response = await baseApi.makeRequest<number>(
      {
        method: 'GET',
        url: `/available/${eventId}`,
      },
      'get',
      options,
    )

    return response?.data !== undefined ? response?.data : null
  }

  /**
   * Отмена резервирования билета
   * @param eventId ID мероприятия
   * @param options Опции запроса
   * @returns true если операция успешна, иначе false
   */
  async function cancelReserveTicket(
    eventId: string,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('ticket.cancelReserveSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'POST',
        url: `/cancel-reserve/${eventId}`,
      },
      'update',
      defaultOptions,
    )

    return response !== null
  }

  // Создаем и возвращаем единый объект API для билетов
  const ticketApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    ticket: baseApi.data,
    tickets: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    getTicketById,
    getMyTickets,
    searchTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    resetState: baseApi.resetState,
    reserveTicket, // Новый метод
    getAvailableTicketsCount, // Новый метод
    cancelReserveTicket, // Новый метод
  })

  return ticketApi
}
