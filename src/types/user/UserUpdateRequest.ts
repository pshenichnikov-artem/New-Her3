import type { UserRoles } from '../enums/UserRoles'

export interface UserUpdateRequest {
  email: string
  fullName: string
  phone: string
  role: UserRoles
}
