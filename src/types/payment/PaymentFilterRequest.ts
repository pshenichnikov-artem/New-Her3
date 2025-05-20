import type { PaymentStatus } from '../enums/PaymentStatus'

export interface PaymentFilterRequest {
  paymentIds: string[] // массив Guid в виде строк
  userIds: string[] // массив Guid в виде строк
  minAmount?: number | null
  maxAmount?: number | null
  status: PaymentStatus[]
  createdAtFrom?: string | null // ISO формат даты
  createdAtTo: string // ISO формат даты
  paidAtFrom?: string | null // ISO формат даты
  paidAtTo: string // ISO формат даты
}
