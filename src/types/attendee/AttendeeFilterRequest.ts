import { DocumentType } from '../enums/DocumentType'

export interface AttendeeFilterRequest {
  attendeeIds: string[] // массив Guid в формате строк
  fullName?: string | null
  birthDateFrom?: string | null // формат ISO
  birthDateTo?: string | null // формат ISO
  docType: DocumentType[]
  docNumber?: string | null
}
