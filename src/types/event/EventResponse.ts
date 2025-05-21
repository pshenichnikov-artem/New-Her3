import type { ImageResponse } from '../image/ImageResponse'

export interface EventResponse {
  id: string // Guid как строка
  title: string
  description: string
  location: string
  startTime: string // ISO формат даты
  endTime: string // ISO формат даты
  price: number
  isActive: boolean
  images: ImageResponse[]
  tag: string
}
