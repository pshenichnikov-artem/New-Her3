export interface EventFilterRequest {
  eventIds: string[]
  dateFrom: string | null
  dateTo: string | null
  minPrice: number | null
  maxPrice: number | null
  title: string[]
  location: string[]
  tag: string[]
  isActive: boolean | null
  description: string | null
}
