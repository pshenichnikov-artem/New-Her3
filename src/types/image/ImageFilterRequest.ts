export interface ImageFilterRequest {
  imageIds: string[] // массив Guid в виде строк
  imageType?: string | null
}
