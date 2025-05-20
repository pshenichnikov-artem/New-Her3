import type { EventResponse } from '../event/EventResponse'

export interface UserCalendarEventResponse {
  id: string // Guid как строка
  event: EventResponse
  note?: string | null
  reminderTime?: string | null // ISO формат даты
}
