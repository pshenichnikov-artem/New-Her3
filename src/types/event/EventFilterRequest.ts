export interface EventFilterRequest {
  eventIds: string[] // массив Guid в виде строк
  date?: string | null // ISO формат даты
  minPrice?: number | null
  maxPrice?: number | null
  title?: string | null
  location?: string | null
  isActive?: boolean | null
}
