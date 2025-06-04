import type { ImageUpdateRequest } from '../image/ImageUpdateRequest'

export interface EventImageUpdateRequest {
  id?: string | null// Guid как строка
  image?: File
  localOrderRank: number,
  imageUrl?: string | null // URL изображения, если есть
}
