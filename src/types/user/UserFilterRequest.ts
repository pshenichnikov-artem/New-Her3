import type { UserRoles } from '../enums/UserRoles'

export interface UserFilterRequest {
  userIds: string[] // массив Guid как строки
  email?: string | null
  phone?: string | null
  fullName?: string | null
  role?: UserRoles | null
  birthDateFrom?: string | null // ISO формат даты
  birthDateTo: string // ISO формат даты
  createdAtFrom?: string | null // ISO формат даты
  createdAtTo: string // ISO формат даты
}
