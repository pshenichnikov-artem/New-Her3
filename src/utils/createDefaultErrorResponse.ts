import type { ApiResponse } from '@/types/ApiResponse'
import i18n from '@/i18n/i18n'

export function createDefaultErrorResponse<T>(): ApiResponse<T | null> {
  return {
    isSuccess: 'error',
    message: i18n.global.t('serverErrors.unexpectedError'),
    data: null,
    error: {
      code: 500,
    },
  }
}
