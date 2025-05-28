import type { TicketStatus } from '../enums/TicketStatus'

export interface TicketUpdateRequest {
  attendeeId?: string | null // Guid как строка
  qrCode: string
  paymentId?: string | null // Guid как строка
}
