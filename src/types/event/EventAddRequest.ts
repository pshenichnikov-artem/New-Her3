import type { EventImageAddRequest } from './EventImageAddRequest'

export interface EventAddRequest {
  title: string
  description: string
  tag: string
  location: string
  startDate: string // ISO формат даты
  endDate: string // ISO формат даты
  ticketCount: number
  price: number
  isActive: boolean
  images: EventImageAddRequest[]
} 
