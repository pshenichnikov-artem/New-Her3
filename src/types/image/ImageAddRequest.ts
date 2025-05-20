export interface ImageAddRequest {
  image: File // В TypeScript/JavaScript IFormFile соответствует File
  imageType?: string
  localOrderRank: number
  entityId?: string | null
  entityTarget?: string | null
}
