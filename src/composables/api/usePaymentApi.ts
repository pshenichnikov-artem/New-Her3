import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { PaymentAddRequest } from '@/types/payment/PaymentAddRequest'
import type { PaymentUpdateRequest } from '@/types/payment/PaymentUpdateRequest'
import type { PaymentSearchRequest } from '@/types/payment/PaymentSearchRequest'
import type { PaymentResponse } from '@/types/payment/PaymentResponse'
import type { Response } from './useBaseApi'
import { reactive } from 'vue'

/**
 * Composable для работы с API платежей
 */
export function usePaymentApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<PaymentResponse>('payments')

  /**
   * Создание платежа
   */
  async function createPayment(
    request: PaymentAddRequest,
    options: RequestOptions = {},
  ): Promise<PaymentResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('payment.createSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<PaymentResponse>(
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
   * Получение платежа по ID
   */
  async function getPaymentById(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentResponse | null> {
    const response = await baseApi.makeRequest<PaymentResponse>(
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
   * Получение платежей текущего пользователя
   */
  async function getPaymentsByCurrentUser(
    request: PaymentSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<PaymentResponse> | null> {
    const response = await baseApi.makeRequest<Response<PaymentResponse>>(
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
   * Поиск платежей
   */
  async function searchPaymentsBase(
    request: PaymentSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<PaymentResponse> | null> {
    const response = await baseApi.makeRequest<Response<PaymentResponse>>(
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
   * Поиск платежей с поддержкой debounce
   */
  const searchPayments = baseApi.withDebounce(searchPaymentsBase, 300)

  /**
   * Обновление данных платежа
   */
  async function updatePayment(
    id: string,
    request: PaymentUpdateRequest,
    options: RequestOptions = {},
  ): Promise<PaymentResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('payment.updateSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<PaymentResponse>(
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
   * Удаление платежа
   */
  async function deletePayment(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('payment.deleteSuccess'),
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

  // Создаем и возвращаем единый объект API для платежей
  const paymentApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    payment: baseApi.data,
    payments: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    createPayment,
    getPaymentById,
    getPaymentsByCurrentUser,
    searchPayments,
    updatePayment,
    deletePayment,
    resetState: baseApi.resetState,
  })

  return paymentApi
}
