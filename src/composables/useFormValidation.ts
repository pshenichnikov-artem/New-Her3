import { reactive, ref, computed } from 'vue'
import type { UnwrapRef, ComputedRef } from 'vue'
import { notificationService } from './useNotification'
import { useI18n } from 'vue-i18n'

interface ValidationState {
  [key: string]: boolean
}

interface ValidationTrigger {
  [key: string]: number
}

/**
 * Интерфейс объекта формы, возвращаемого useFormValidation
 */
export interface FormValidation {
  // Состояния
  validationState: UnwrapRef<ValidationState>
  validationTrigger: UnwrapRef<ValidationTrigger>
  isValidating: boolean
  allFieldsValid: ComputedRef<boolean>
  firstInvalidField: ComputedRef<string | undefined>

  // Методы
  updateValidationState: (field: string, isValid: boolean) => void
  validateForm: () => Promise<boolean>
  handleSubmit: (submitFn: () => Promise<void> | void) => Promise<void>
  resetValidation: () => void
}

/**
 * Composable для управления валидацией форм
 * @param fields Массив имен полей формы для валидации
 * @returns Объект с методами и состоянием для валидации
 */
export function useFormValidation(fields: string[]): FormValidation {
  const { t } = useI18n()

  // Состояния валидации для каждого поля
  const validationState = reactive<ValidationState>(
    fields.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
  )

  // Триггеры для запуска валидации
  const validationTrigger = reactive<ValidationTrigger>(
    fields.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}),
  )

  // Индикатор, показывающий запущен ли процесс валидации
  const isValidating = ref(false)

  // Вычисляемое свойство, проверяющее валидны ли все поля
  const allFieldsValid = computed(() =>
    Object.values(validationState).every((state) => state === true),
  )

  // Первое невалидное поле (для фокуса)
  const firstInvalidField = computed(() => fields.find((field) => !validationState[field]))

  /**
   * Обновляет состояние валидации для указанного поля
   * @param field Имя поля
   * @param isValid Статус валидации (true/false)
   */
  function updateValidationState(field: string, isValid: boolean) {
    if (field in validationState) {
      validationState[field] = isValid
    }
  }

  /**
   * Принудительно запускает валидацию всех полей
   * @returns Promise<boolean> - результат валидации
   */
  function validateForm(): Promise<boolean> {
    isValidating.value = true

    // Увеличиваем счетчики для всех полей, чтобы запустить валидацию
    fields.forEach((field) => {
      validationTrigger[field] += 1
    })

    // Небольшая задержка, чтобы реактивность успела обновиться
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = allFieldsValid.value

        // Если форма невалидна, прокручиваем к первому полю с ошибкой
        if (!isValid && firstInvalidField.value) {
          const element = document.getElementById(firstInvalidField.value)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.focus()
          }
        }

        isValidating.value = false
        resolve(isValid)
      }, 200)
    })
  }

  /**
   * Обработчик отправки формы с валидацией
   * @param submitFn Функция, выполняемая при успешной валидации
   * @returns Promise<void>
   */
  async function handleSubmit(submitFn: () => Promise<void> | void): Promise<void> {
    try {
      const isValid = await validateForm()

      if (!isValid) {
        notificationService.error(t('common.errors.formHasErrors'))
        return
      }

      await submitFn()
    } catch (error) {
      console.error('Form submission error:', error)
      notificationService.error(
        error instanceof Error ? error.message : t('common.errors.submitError'),
      )
    }
  }

  /**
   * Сбрасывает состояния валидации всех полей
   */
  function resetValidation() {
    fields.forEach((field) => {
      validationState[field] = false
    })
  }

  // Возвращаем единый объект формы
  return {
    // Состояния
    validationState,
    validationTrigger,
    isValidating: isValidating.value,
    allFieldsValid,
    firstInvalidField,

    // Методы
    updateValidationState,
    validateForm,
    handleSubmit,
    resetValidation,
  }
}
