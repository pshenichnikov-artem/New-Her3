import { useI18n } from 'vue-i18n'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { TicketStatus } from '@/types/enums/TicketStatus'
import { computed } from 'vue'

export function useStatusTranslation() {
  const { t } = useI18n()

  /**
   * Возвращает переведенный текст для статуса платежа
   */
  const translatePaymentStatus = (status: PaymentStatus) => {
    return t(`paymentStatus.${status}`)
  }

  /**
   * Возвращает переведенный текст для статуса билета
   */
  const translateTicketStatus = (status: TicketStatus) => {
    return t(`ticketStatus.${status}`)
  }

  /**
   * Возвращает CSS класс для отображения статуса платежа
   */
  const getPaymentStatusClass = (status: PaymentStatus) => {
    const statusClasses = {
      [PaymentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [PaymentStatus.WaitingForCapture]: 'bg-blue-100 text-blue-800',
      [PaymentStatus.Succeeded]: 'bg-green-100 text-green-800',
      [PaymentStatus.Canceled]: 'bg-gray-100 text-gray-800',
      [PaymentStatus.Failed]: 'bg-red-100 text-red-800',
    }

    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Возвращает CSS класс для отображения статуса билета
   */
  const getTicketStatusClass = (status: TicketStatus) => {
    const statusClasses = {
      [TicketStatus.Available]: 'bg-green-100 text-green-800',
      [TicketStatus.Reserved]: 'bg-blue-100 text-blue-800',
      [TicketStatus.Paid]: 'bg-purple-100 text-purple-800',
      [TicketStatus.Used]: 'bg-gray-100 text-gray-800',
      [TicketStatus.Cancelled]: 'bg-red-100 text-red-800',
    }

    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }

  return {
    translatePaymentStatus,
    translateTicketStatus,
    getPaymentStatusClass,
    getTicketStatusClass,
  }
}
