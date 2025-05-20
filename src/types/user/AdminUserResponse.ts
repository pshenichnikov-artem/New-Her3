export interface AdminUserResponse {
  id: string // Guid как строка
  fullName: string
  email: string
  phone: string
  role: string
  createdAt: string // ISO формат даты
}
