import type { ImageUpdateRequest } from '../image/ImageUpdateRequest'

export interface EventImageUpdateRequest extends ImageUpdateRequest {
  id: string // Guid как строка
}
