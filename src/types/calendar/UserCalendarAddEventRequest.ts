export interface UserCalendarAddEventRequest {
  eventId: string // Guid как строка
  note?: string | null
  reminderTime?: string | null // ISO формат даты
}
