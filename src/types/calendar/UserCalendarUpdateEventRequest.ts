export interface UserCalendarUpdateEventRequest {
  eventId?: string | null // Guid как строка
  note?: string | null
  reminderTime?: string | null // ISO формат даты
}
