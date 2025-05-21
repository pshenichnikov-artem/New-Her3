export interface EventFilterRequest {
  eventIds: string[] // массив Guid в виде строк
  dateFrom?: string | null
  dateTo?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  title?: string | null
  location?: string | null
  isActive?: boolean | null
}
