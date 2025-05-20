import type { EventFilterRequest } from './EventFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface EventSearchRequest {
  filter: EventFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
