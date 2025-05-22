import type { UserRoles } from '../enums/UserRoles'

export interface UserUpdateRequest {
  fullName: string
  email: string
  phone: string
  role?: UserRoles | null
}
