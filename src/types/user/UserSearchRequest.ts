import type { UserFilterRequest } from './UserFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface UserSearchRequest {
  filter: UserFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
