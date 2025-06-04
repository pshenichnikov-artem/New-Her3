import type { TicketStatus } from '../enums/TicketStatus'

export interface TicketFilterRequest {
  ticketIds: string[] // массив Guid в виде строк
  eventIds: string[] // массив Guid в виде строк
  buyerIds: string[] // массив Guid в виде строк
  buyerName?: string | null
  attendeeIds: string[] // массив Guid в виде строк
  attendeeName?: string | null
  paymentIds: string[] // массив Guid в виде строк
}
