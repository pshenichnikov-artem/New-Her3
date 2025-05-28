import type { AttendeeAddRequest } from "../attendee/AttendeeAddRequest"

export interface ReserveTicketRequest {
    eventId: string // Guid как строка
    userId: string // Guid как строка
    attendees: AttendeeAddRequest[] // Массив объектов с данными участников
}