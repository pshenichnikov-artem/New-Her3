import { useI18n } from 'vue-i18n'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { TicketStatus } from '@/types/enums/TicketStatus'
import { DocumentType } from '@/types/enums/DocumentType'
import { UserRoles } from '@/types/enums/UserRoles'
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
   * Возвращает переведенный текст для типа документа
   */
  const translateDocumentType = (type: string | number | null): string => {
    if (type === null) return t('common.noData');

    const typeNum = typeof type === 'string' ? parseInt(type) : type;
    const typeMap: Record<number, string> = {
        0: 'passport',
        1: 'driverLicense',
        2: 'foreignPassport',
        3: 'studentCard',
        4: 'virthCertificate'
    };

    return t(`documentTypes.${typeMap[typeNum] || 'unknown'}`);
  }

  /**
   * Возвращает переведенный текст для роли пользователя
   */
  const translateUserRole = (role: number | null): string => {
    if (role === null) return t('common.noData');

    const roleMap: Record<number, string> = {
      [UserRoles.User]: 'user',
      [UserRoles.Admin]: 'admin'
    };

    return t(`roles.${roleMap[role] || 'unknown'}`);
  }

  /**
   * Возвращает CSS класс для отображения статуса платежа
   */
  const getPaymentStatusClass = (status: PaymentStatus) => {
    const statusClasses = {
      [PaymentStatus.WaitingForPayment]: 'bg-blue-100 text-blue-800',
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

  /**
   * Возвращает опции для выпадающего списка типов документов
   */
  const getDocumentTypeOptions = () => {
    return Object.values(DocumentType).map((type) => ({
      value: type,
      label: translateDocumentType(type),
    }))
  }

  return {
    translatePaymentStatus,
    translateTicketStatus,
    translateDocumentType,
    translateUserRole,
    getPaymentStatusClass,
    getTicketStatusClass,
    getDocumentTypeOptions,
  }
}
