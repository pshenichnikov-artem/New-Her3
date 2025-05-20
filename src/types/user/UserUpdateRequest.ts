import type { UserRoles } from '../enums/UserRoles'

export interface UserUpdateRequest {
  fullName?: string | null
  email?: string | null
  phone?: string | null
  role?: UserRoles | null
}
