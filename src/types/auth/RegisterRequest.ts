export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phone: string
  birthDate: string // формат ISO, например "2023-01-01"
}
