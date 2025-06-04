import type { UserRoles } from '../enums/UserRoles'

export interface UserFilterRequest {
  userIds: string[] // массив Guid как строки  
  email?: string | null
  phone?: string | null
  fullName?: string | null
  roles: UserRoles[] // Изменено на массив ролей
  birthDateFrom?: string | null
  birthDateTo?: string | null  
  createdAtFrom?: string | null
  createdAtTo?: string | null
}
