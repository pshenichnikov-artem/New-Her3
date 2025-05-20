import { DocumentType } from '../enums/DocumentType'

export interface AttendeeResponse {
  id: string // Guid
  fullName: string
  birthDate: string // формат ISO
  documentType: DocumentType
  documentNumber: string
  createdAt: string // формат ISO
}
