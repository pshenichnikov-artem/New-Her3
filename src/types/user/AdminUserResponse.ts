import type { UserRoles } from '../enums/UserRoles'

export interface AdminUserResponse {
  id: string // Guid как строка
  fullName: string
  email: string
  phone: string
  role: UserRoles
  createdAt: string // ISO формат даты
}
