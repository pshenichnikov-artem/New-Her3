export interface EventFilterRequest {
  eventIds: string[] // массив Guid в виде строк
  description?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  title?: string[] | null
  location?: string[] | null
  isActive?: boolean | null
  tag?: string[] | null
  //TODO Списки не наллабл
}
