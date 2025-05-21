import type { ApiError } from '@/types/ApiError'

export interface ApiResponse<T> {
  isSuccess: boolean
  message: string
  data?: T
  error?: ApiError
}
