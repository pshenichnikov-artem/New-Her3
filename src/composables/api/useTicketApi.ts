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
        method: 'GET',
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
  })

  return ticketApi
}
