import { useI18n } from 'vue-i18n'
import { useBaseApi, type RequestOptions } from './useBaseApi'
import type { ImageAddRequest } from '@/types/image/ImageAddRequest'
import type { ImageUpdateRequest } from '@/types/image/ImageUpdateRequest'
import type { ImageSearchRequest } from '@/types/image/ImageSearchRequest'
import type { ImageResponse } from '@/types/image/ImageResponse'
import type { Response } from './useBaseApi'
import { reactive } from 'vue'

/**
 * Composable для работы с API изображений
 */
export function useImageApi() {
  const { t } = useI18n()

  // Используем базовый API composable
  const baseApi = useBaseApi<ImageResponse>('images')

  /**
   * Получение изображения по ID
   */
  async function getImageById(
    id: string,
    options: RequestOptions = {},
  ): Promise<ImageResponse | null> {
    const response = await baseApi.makeRequest<ImageResponse>(
      {
        method: 'GET',
        url: `/${id}`,
      },
      'get',
      options,
    )

    return response?.data || null
  }

  /**
   * Получение изображений по типу
   */
  async function getImagesByType(
    imageType: string,
    options: RequestOptions = {},
  ): Promise<ImageResponse[] | null> {
    const response = await baseApi.makeRequest<ImageResponse[]>(
      {
        method: 'GET',
        url: '',
        params: { imageType },
      },
      'search',
      options,
    )

    if (response?.data) {
      baseApi.items.value = response.data
      return response.data
    }

    return null
  }

  /**
   * Загрузка изображения
   * Примечание: Необходима обработка FormData для файлов
   */
  async function uploadImage(
    request: ImageAddRequest,
    options: RequestOptions = {},
  ): Promise<ImageResponse | null> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('image.uploadSuccess'),
      ...options,
    }

    // Создаем FormData для отправки файла
    const formData = new FormData()
    formData.append('image', request.image)

    if (request.imageType) {
      formData.append('imageType', request.imageType)
    }

    formData.append('localOrderRank', request.localOrderRank.toString())

    if (request.entityId) {
      formData.append('entityId', request.entityId)
    }

    if (request.entityTarget) {
      formData.append('entityTarget', request.entityTarget)
    }

    const response = await baseApi.makeRequest<ImageResponse>(
      {
        method: 'POST',
        url: '',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      'create',
      defaultOptions,
    )

    return response?.data || null
  }

  /**
   * Удаление изображения
   */
  async function deleteImage(id: string, options: RequestOptions = {}): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('image.deleteSuccess'),
      ...options,
    }

    const response = await baseApi.makeRequest<void>(
      {
        method: 'DELETE',
        url: `/${id}`,
      },
      'delete',
      defaultOptions,
    )

    return response !== null
  }

  /**
   * Обновление изображения
   */
  async function updateImage(
    id: string,
    request: ImageUpdateRequest,
    options: RequestOptions = {},
  ): Promise<boolean> {
    const defaultOptions = {
      showSuccessNotification: true,
      successMessage: t('image.updateSuccess'),
      ...options,
    }

    // Если есть файл, нужно использовать FormData
    if (request.image) {
      const formData = new FormData()
      formData.append('image', request.image)

      if (request.imageType) {
        formData.append('imageType', request.imageType)
      }

      formData.append('localOrderRank', request.localOrderRank.toString())

      if (request.entityId) {
        formData.append('entityId', request.entityId)
      }

      if (request.entityTarget) {
        formData.append('entityTarget', request.entityTarget)
      }

      const response = await baseApi.makeRequest<void>(
        {
          method: 'PUT',
          url: `/${id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        'update',
        defaultOptions,
      )

      return response !== null
    }
    // Если нет файла, можно отправить JSON
    else {
      const response = await baseApi.makeRequest<void>(
        {
          method: 'PUT',
          url: `/${id}`,
          data: request,
        },
        'update',
        defaultOptions,
      )

      return response !== null
    }
  }

  /**
   * Поиск изображений
   */
  async function searchImagesBase(
    request: ImageSearchRequest,
    options: RequestOptions = {},
  ): Promise<Response<ImageResponse> | null> {
    const response = await baseApi.makeRequest<Response<ImageResponse>>(
      {
        method: 'POST',
        url: '/search',
        data: request,
      },
      'search',
      options,
    )

    return response?.data || null
  }

  /**
   * Поиск изображений с поддержкой debounce
   */
  const searchImages = baseApi.withDebounce(searchImagesBase, 300)

  // Создаем и возвращаем единый объект API для изображений
  const imageApi = reactive({
    // Состояния
    loading: baseApi.loading,
    isLoading: baseApi.isLoading,
    image: baseApi.data,
    images: baseApi.items,
    totalCount: baseApi.totalCount,
    error: baseApi.error,

    // Методы
    getImageById,
    getImagesByType,
    uploadImage,
    deleteImage,
    updateImage,
    searchImages,
    resetState: baseApi.resetState,
  })

  return imageApi
}
