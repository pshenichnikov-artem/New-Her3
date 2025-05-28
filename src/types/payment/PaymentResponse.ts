import type { UserResponse } from '../user/UserResponse'
import type { PaymentStatus } from '../enums/PaymentStatus'

export interface PaymentResponse {
  id: string // Guid в виде строки
  buyer: UserResponse | null
  amount: number
  status: PaymentStatus
  createdAt: string // ISO формат даты
  paidAt?: string | null // ISO формат даты
  qrUrl: string
}
