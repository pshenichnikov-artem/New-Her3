<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-text-form mb-1">{{ label }}</label>
    <div class="relative flex items-center">
      <input
        class="w-full bg-form-light text-black border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 pr-10"
        :class="{
          'border-form-border focus:ring-form-focus': !error && !isRed,
          'border-green-500 focus:ring-green-500': isValid && !error && !isEmpty,
          'border-red-500 focus:ring-red-500': isRed,
        }" :id="id" :type="computedInputType" :placeholder="placeholder" :value="modelValue" @input="handleInput"
        @blur="handleBlur" />
      <!-- Глазик -->
      <button v-if="type === 'password'" type="button"
        class="absolute inset-y-0 right-2 text-gray-400 text-sm flex items-center justify-center"
        @click="togglePasswordVisibility">
        <img :src="showPassword ? '/images/open_eye.png' : 'images/close_eye.png'" alt="eye icon" class="w-6 h-6" />
      </button>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Определение типов
type ValidationRule = {
  name: string;
  param?: string;
};

export interface ValidationProps {
  id?: string;
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  validationRules?: string | ValidationRule[];
  errorMessages?: Record<string, string>;
  compareWith?: string | null;
  triggerValidation?: number;
  readonly?: boolean;
  min?: string;
  max?: string;
}

// Определяем пропсы и эмиты
const props = withDefaults(defineProps<ValidationProps>(), {
  id: '',
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  validationRules: '',
  errorMessages: () => ({}),
  compareWith: null,
  triggerValidation: 0,
  readonly: false,
  min: '',
  max: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'input': [value: string];
  'update:validationErrors': [error: Record<string, string> | null];
  'valid': [isValid: boolean];
}>();

// Состояние компонента
const error = ref<string | null>(null);
const isValid = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const wasValidated = ref<boolean>(false);  // Отслеживаем, была ли уже выполнена валидация
const forceShowError = ref<boolean>(false); // Флаг для принудительного отображения ошибок
const isEmpty = computed(() => !props.modelValue); // Вычисляемое свойство для проверки на пустоту

// Вычисляемое свойство для определения, должен ли инпут быть красным
const isRed = computed(() => {
  // Инпут красный, если есть ошибка или если была принудительная валидация и поле невалидно, но не пустое
  return (error.value !== null) || (forceShowError.value && !isValid.value && !isEmpty.value);
});

// Вычисляемое свойство для определения видимости пароля
const computedInputType = computed((): string => {
  if (props.type !== 'password') return props.type;
  return showPassword.value ? 'text' : 'password';
});

// Кастомные паттерны валидации
const customPatterns: Record<string, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9]{10,15}$/,
  name: /^(?:[A-Z][a-z]{2,49}|[А-ЯЁ][а-яё]{2,49})$/,
  lastName: /^(?:[A-Z][a-z]{2,49}|[А-ЯЁ][а-яё]{2,49})$/,
  fullName: /^((?:[A-Z][a-z]{2,}|[А-ЯЁ][а-яё]{2,})\s+(?:[A-Z][a-z]{2,}|[А-ЯЁ][а-яё]{2,})(?:\s+(?:[A-Z][a-z]{2,}|[А-ЯЁ][а-яё]{2,}))?)$/,
  password: /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)(?=.*[!@#$%^&*]).{8,100}$/,
  onlyRussian: /^[А-ЯЁа-яё\s]+$/,
  onlyEnglish: /^[A-Za-z\s]+$/,
};

// Функция отображения/скрытия пароля
const togglePasswordVisibility = (): void => {
  showPassword.value = !showPassword.value;
};

// Вычисляемое свойство, возвращающее статус валидации
const isValidated = computed((): boolean => {
  return isValid.value && !error.value;
});

// Функция парсинга правил валидации
function parseRules(rules: string | ValidationRule[] | undefined): ValidationRule[] {
  if (!rules) return [];

  if (Array.isArray(rules)) return rules;

  return rules.split('|').map((rule) => {
    const [name, param] = rule.split(':');
    return { name, param };
  });
}

// Определение валидаторов
function getValidators(): Record<string, (v: string, p?: string) => string | boolean> {
  return {
    required: (v) => !!v || props.errorMessages.required || t('validation.required'),
    minLength: (v, p) => (v.length >= +(p || 0)) ||
      props.errorMessages.minLength || t('validation.minLength', { length: p }),
    maxLength: (v, p) => (v.length <= +(p || 0)) ||
      props.errorMessages.maxLength || t('validation.maxLength', { length: p }),
    min: (v, p) => (+v >= +(p || 0)) ||
      props.errorMessages.min || t('validation.min', { min: p }),
    max: (v, p) => (+v <= +(p || 0)) ||
      props.errorMessages.max || t('validation.max', { max: p }),
    pattern: (v, p) => new RegExp(p || '').test(v) || props.errorMessages.pattern || t('validation.pattern'),
    date: (v) => {
      if (!v) return true; // Пустая дата валидна если поле не обязательное
      const date = new Date(v);
      return !isNaN(date.getTime()) || props.errorMessages.date || t('validation.date');
    },
    match: (v) => {
      if (props.compareWith == null) return props.errorMessages.match || 'No reference value for comparison';
      if (v !== props.compareWith) return props.errorMessages.match || t('validation.password.mismatch');
      return true;
    },
    name: (v) => {
      if (v.length < 3) return props.errorMessages.nameMinLength || t('validation.name.minLength');
      if (v.length > 50) return props.errorMessages.nameMaxLength || t('validation.name.maxLength');
      if (!/^[A-ZА-ЯЁ]/.test(v)) return props.errorMessages.nameUppercase || t('validation.name.uppercase');
      if (!customPatterns.name.test(v)) return props.errorMessages.namePattern || t('validation.name.pattern');
      return true;
    },
    lastName: (v) => {
      if (v.length < 3) return props.errorMessages.lastNameMinLength || t('validation.minLength', { length: 3 });
      if (v.length > 50) return props.errorMessages.lastNameMaxLength || t('validation.name.maxLength');
      if (!/^[A-ZА-ЯЁ]/.test(v)) return props.errorMessages.lastNameUppercase || t('validation.lastName.uppercase');
      if (!customPatterns.lastName.test(v)) return props.errorMessages.lastNamePattern || t('validation.lastName.pattern');
      return true;
    },
    email: (v) => customPatterns.email.test(v) || props.errorMessages.email || t('validation.email.invalid'),
    phone: (v) => customPatterns.phone.test(v) || props.errorMessages.phone || t('validation.phone.pattern'),
    password: (v) => {
      if (v.length < 8) return props.errorMessages.passwordMinLength || t('validation.password.minLength', { length: 8 });
      if (!/[A-ZА-ЯЁ]/.test(v)) return props.errorMessages.passwordUppercase || t('validation.password.uppercase');
      if (!/[!@#$%^&*]/.test(v)) return props.errorMessages.passwordSpecial || t('validation.password.special');
      if (!/\d/.test(v)) return props.errorMessages.passwordDigit || t('validation.password.digit');
      if (!customPatterns.password.test(v)) return props.errorMessages.passwordPattern || t('validation.password.pattern');
      return true;
    },
    onlyRussian: (v) => customPatterns.onlyRussian.test(v) || t('validation.onlyRussian'),
    onlyEnglish: (v) => customPatterns.onlyEnglish.test(v) || t('validation.onlyEnglish'),
    passport: (v: string) => {
      if (!v) return props.errorMessages.passportRequired || t('validation.passport.required');
      if (!/^\d{4}\s?\d{6}$/.test(v)) return props.errorMessages.passportPattern || t('validation.passport.pattern');
      return true;
    },

    birthDocument: (v: string) => {
      if (!v) return props.errorMessages.birthDocumentRequired || t('validation.birthDocument.required');
      if (!/^[IVXLCDM]{1,5}-\d{6}$/.test(v)) {
        // Формат может быть вида "IV-123456" — серия римскими цифрами, затем номер
        return props.errorMessages.birthDocumentPattern || t('validation.birthDocument.pattern');
      }
      return true;
    },

    driverLicense: (v: string) => {
      if (!v) return props.errorMessages.driverLicenseRequired || t('validation.driverLicense.required');
      if (!/^\d{4}\s?\d{6}$/.test(v)) return props.errorMessages.driverLicensePattern || t('validation.driverLicense.pattern');
      return true;
    },

    studentCard: (v: string) => {
      if (!v) return props.errorMessages.studentCardRequired || t('validation.studentCard.required');
      if (!/^[А-Яа-яA-Za-z0-9\-]{5,20}$/.test(v)) {
        // Допускаются буквы, цифры, дефис — общая маска для студенческого
        return props.errorMessages.studentCardPattern || t('validation.studentCard.pattern');
      }
      return true;
    },
    fullName: (v) => {
      const words = v.trim().split(/\s+/);

      // Проверка на количество слов (от 2 до 3)
      if (words.length < 2 || words.length > 3) {
        return props.errorMessages.fullNameWordsCount || t('validation.fullName.wordsCount');
      }

      // Проверка каждого слова
      for (const word of words) {
        // Проверка длины слова (минимум 3 символа)
        if (word.length < 3) {
          return props.errorMessages.fullNameWordLength || t('validation.fullName.wordLength');
        }

        // Проверка первой буквы (должна быть заглавной)
        if (!/^[A-ZА-ЯЁ]/.test(word)) {
          return props.errorMessages.fullNameUppercase || t('validation.fullName.uppercase');
        }

        // Проверка, что слово содержит только буквы
        if (!/^[A-Za-zА-ЯЁа-яё]+$/.test(word)) {
          return props.errorMessages.fullNameLettersOnly || t('validation.fullName.lettersOnly');
        }
      }

      // Проверка по регулярному выражению (для дополнительной валидации)
      if (!customPatterns.fullName.test(v)) {
        return props.errorMessages.fullNamePattern || t('validation.fullName.pattern');
      }

      return true;
    },
  };
}

// Функция валидации ввода
function validate(): boolean {
  error.value = null;
  isValid.value = false;
  wasValidated.value = true;

  // Если значение пустое
  if (isEmpty.value) {
    const rules = parseRules(props.validationRules);
    // Если поле не обязательное
    if (!rules.some(r => r.name === 'required')) {
      isValid.value = true;
      emit('update:validationErrors', null);
      emit('valid', true);
      forceShowError.value = false; // Сбрасываем флаг принудительного показа ошибок
      return true;
    } else if (forceShowError.value) {
      // Если поле обязательное и нужно показать ошибки
      error.value = props.errorMessages.required || t('validation.required');
      emit('update:validationErrors', { [props.id]: error.value });
      emit('valid', false);
      return false;
    }
    // Если просто пусто и не нужно показывать ошибки, то ничего не делаем
    emit('valid', false);
    return false;
  }

  const rules = parseRules(props.validationRules);
  const validators = getValidators();

  for (const { name, param } of rules) {
    const validator = validators[name];
    if (validator) {
      const result = validator(typeof props.modelValue === 'number' ? props.modelValue.toString() : props.modelValue, param);
      if (result !== true) {
        // Используем переданные сообщения об ошибках или берем из локализации
        error.value = result as string;
        emit('update:validationErrors', { [props.id]: error.value });
        emit('valid', false);
        return false;
      }
    }
  }

  isValid.value = true;
  emit('update:validationErrors', null);
  emit('valid', true);
  return true;
}

// Обработчик потери фокуса
function handleBlur(): void {
  wasValidated.value = true;

  // При потере фокуса выполняем валидацию только если поле не пустое или обязательное
  if (!isEmpty.value || parseRules(props.validationRules).some(r => r.name === 'required')) {
    validate();
  }
}

// Обработчик ввода значений
function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  emit('update:modelValue', value);
  emit('input', value);

  // Если значение полностью стерли
  if (value === '') {
    const rules = parseRules(props.validationRules);
    error.value = null; // Всегда сбрасываем ошибку при пустом поле

    if (!rules.some(r => r.name === 'required')) {
      // Если поле не обязательное, считаем его валидным
      isValid.value = true;
      forceShowError.value = false; // Сбрасываем показ ошибок
      wasValidated.value = false;   // Сбрасываем флаг валидации
      emit('valid', true);
    } else {
      // Если поле обязательное, но мы только что стерли значение - не показываем ошибку сразу
      isValid.value = false;
      forceShowError.value = false; // Скрываем ошибки, пока поле пустое
      emit('valid', false);
    }
  }
  // Проверяем валидацию при любом вводе, если значение не пустое
  else {
    // Если пользователь начал вводить, считаем что поле было валидировано
    wasValidated.value = true;
    validate();
  }
}

// Экспортируем метод validate и состояние isValidated для использования извне
defineExpose({
  validate,
  isValidated
});

// Валидируем значение при монтировании компонента
onMounted(() => {
  if (props.modelValue) {
    wasValidated.value = true; // Устанавливаем флаг валидации, если есть начальное значение
    validate();
  }
});

// Следим за изменениями triggerValidation для запуска валидации
watch(() => props.triggerValidation, () => {
  if (props.triggerValidation > 0) {
    forceShowError.value = true; // Показываем ошибки при принудительной валидации
    validate();
  }
});

// Следим за изменениями modelValue для автоматической валидации
watch(() => props.modelValue, () => {
  // Если поле не пустое и было уже провалидировано, то продолжаем валидацию
  if (!isEmpty.value && wasValidated.value) {
    validate();
  } else if (isEmpty.value) {
    // При пустом поле сбрасываем ошибки, но сохраняем состояние валидации
    error.value = null;
    if (!parseRules(props.validationRules).some(r => r.name === 'required')) {
      isValid.value = true;
      emit('valid', true);
    }
  }
});

// Следим за изменениями compareWith для перевалидации полей, зависящих от других значений
watch(() => props.compareWith, () => {
  if (wasValidated.value && !isEmpty.value) {
    // Если поле уже было валидировано и не пустое, перепроверяем
    validate();
  }
});
</script>
