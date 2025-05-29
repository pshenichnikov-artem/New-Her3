import type { ImageAddRequest } from '../image/ImageAddRequest'

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

  image: File[] // В TypeScript/JavaScript IFormFile соответствует File
  localOrderRank: number[]
}
