import type { ImageAddRequest } from '../image/ImageAddRequest'

export interface EventAddRequest {
  title: string
  description: string
  location: string
  startDate: string // ISO формат даты
  endDate: string // ISO формат даты
  ticketCount: number
  images: ImageAddRequest[]
}
