import type { TicketStatus } from '../enums/TicketStatus'

export interface TicketUpdateRequest {
  status: TicketStatus
  attendeeId?: string | null // Guid как строка
  buyerId?: string | null // Guid как строка
}
