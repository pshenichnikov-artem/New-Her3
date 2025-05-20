import type { AttendeeFilterRequest } from './AttendeeFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface AttendeeSearchRequest {
  filter: AttendeeFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
