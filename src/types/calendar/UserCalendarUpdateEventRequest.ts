export interface UserCalendarUpdateEventRequest {
  eventId: string // Guid как строка
  userId?: string | null // Guid как строка
  note?: string | null
  reminderTime?: string | null // ISO формат даты
}
