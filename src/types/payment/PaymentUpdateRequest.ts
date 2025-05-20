import type { PaymentStatus } from '../enums/PaymentStatus'

export interface PaymentUpdateRequest {
  status?: PaymentStatus | null
  paidAt?: string | null // ISO формат даты
  qrUrl?: string | null
}
