import { DocumentType } from '../enums/DocumentType'

export interface AttendeeAddRequest {
  fullName: string
  birthDate: string // формат ISO, например "2023-01-01"
  documentType: DocumentType
  documentNumber: string
  userId?: string | null // Guid в TypeScript обычно представлен строкой
  ticketId?: string | null // Guid
}
