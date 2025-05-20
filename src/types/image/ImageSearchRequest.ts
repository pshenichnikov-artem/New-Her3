import type { ImageFilterRequest } from './ImageFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface ImageSearchRequest {
  filter: ImageFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
