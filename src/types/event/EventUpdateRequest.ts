import type { EventImageUpdateRequest } from './EventImageUpdateRequest'

export interface EventUpdateRequest {
  title: string
  description: string
  location: string
  startDate: string // ISO формат даты
  endDate: string // ISO формат даты
  ticketCount: number
  images: EventImageUpdateRequest[]
}
