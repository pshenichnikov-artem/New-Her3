import type { TicketFilterRequest } from './TicketFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface TicketSearchRequest {
  filter: TicketFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
