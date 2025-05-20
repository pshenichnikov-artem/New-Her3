import type { PaymentFilterRequest } from './PaymentFilterRequest'
import type { SortRequest } from '../common/SortRequest'
import type { PaginationRequest } from '../common/PaginationRequest'

export interface PaymentSearchRequest {
  filter: PaymentFilterRequest
  sort: SortRequest[]
  pagination: PaginationRequest
}
