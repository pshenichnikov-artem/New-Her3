import type { TicketStatus } from '../enums/TicketStatus'

export interface TicketShortResponse {
  id: string // Guid как строка
  status: TicketStatus
}
