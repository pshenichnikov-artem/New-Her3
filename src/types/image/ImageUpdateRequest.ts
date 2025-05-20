export interface ImageUpdateRequest {
  image?: File
  imageType?: string
  localOrderRank: number
  entityId?: string | null
  entityTarget?: string | null
}
