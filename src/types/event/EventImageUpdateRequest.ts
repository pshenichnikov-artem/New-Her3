import type { ImageUpdateRequest } from '../image/ImageUpdateRequest'

export interface EventImageUpdateRequest {
  id: string // Guid как строка
  image: ImageUpdateRequest // Объект с данными для обновления изображения
}
