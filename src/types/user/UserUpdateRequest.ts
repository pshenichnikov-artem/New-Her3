import type { UserRoles } from '../enums/UserRoles'

export interface UserUpdateRequest {
  email: string
  fullName: string
  phone: string
  role: UserRoles | null
  birthDate: string // формат ISO, например "2023-01-01"
}
