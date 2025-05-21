import type { UserRoles } from '../enums/UserRoles'

export interface UserResponse {
  id: string // Guid как строка
  fullName: string
  email: string
  phone: string
  role: UserRoles
}
