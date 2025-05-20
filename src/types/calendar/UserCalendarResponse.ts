import type { UserResponse } from '../user/UserResponse'
import type { UserCalendarEventResponse } from './UserCalendarEventResponse'

export interface UserCalendarResponse {
  user: UserResponse
  events?: UserCalendarEventResponse[]
}
