import type { TicketStatus } from '../enums/TicketStatus'
import type { AttendeeResponse } from '../attendee/AttendeeResponse'
import type { PaymentResponse } from '../payment/PaymentResponse'
import type { EventResponse } from '../event/EventResponse'

export interface TicketResponse {
  id: string // Guid как строка
  eventId: string // Guid как строка
  event: EventResponse
  qrCode: string
  attendee: AttendeeResponse | null
  payment: PaymentResponse | null
}
