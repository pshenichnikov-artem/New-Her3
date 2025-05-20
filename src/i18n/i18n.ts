import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    paymentStatus: {
      Pending: 'Ожидание оплаты',
      WaitingForCapture: 'Ожидание подтверждения',
      Succeeded: 'Оплачено',
      Canceled: 'Отменено',
      Failed: 'Ошибка оплаты',
    },
    ticketStatus: {
      Available: 'Доступен',
      Reserved: 'Забронирован',
      Paid: 'Оплачен',
      Used: 'Использован',
      Cancelled: 'Отменён',
    },
    basePagination: {
      show: 'Показать',
      prev: 'Назад',
      next: 'Вперёд',
    },
    filters: {
      select: 'Выбрать',
      search: 'Поиск',
      apply: 'Применить',
      reset: 'Сбросить',
      from: 'От',
      to: 'До',
      selectDate: 'Выберите дату',
    },
    datePicker: {
      selectDate: 'Выберите дату',
      selectDateRange: 'Выберите диапазон дат',
      time: 'Время',
      startTime: 'Время начала',
      endTime: 'Время окончания',
      from: 'От',
      to: 'До',
      apply: 'Применить',
      clear: 'Очистить',
    },
    formatter: {
      monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      weekdayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      currency: {
        RUB: '₽',
        USD: '$',
        EUR: '€',
      },
    },

    // Добавляем новые группы локализаций
    fields: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phone: 'Телефон',
      password: 'Пароль',
      confirmPassword: 'Подтверждение пароля',
      role: 'Роль',
      user: 'Пользователь',
      seller: 'Продавец',
      fullName: 'Полное имя',
    },

    validation: {
      required: 'Обязательное поле',
      minLength: 'Минимум {length} символов',
      maxLength: 'Максимум {length} символов',
      pattern: 'Неверный формат',

      name: {
        required: 'Укажите имя',
        minLength: 'Имя должно содержать минимум 3 символа',
        maxLength: 'Имя должно содержать максимум 50 символов',
        uppercase: 'Имя должно начинаться с заглавной буквы',
        pattern: 'Допускаются только буквы',
      },

      lastName: {
        required: 'Укажите фамилию',
        minLength: 'Фамилия должна содержать минимум 3 символа',
        maxLength: 'Фамилия должна содержать максимум 50 символов',
        uppercase: 'Фамилия должна начинаться с заглавной буквы',
        pattern: 'Допускаются только буквы',
      },

      email: {
        required: 'Укажите email',
        invalid: 'Неверный формат email',
      },

      phone: {
        required: 'Укажите номер телефона',
        pattern: 'Неверный формат номера телефона',
      },

      password: {
        required: 'Укажите пароль',
        confirmRequired: 'Подтвердите пароль',
        minLength: 'Пароль должен содержать минимум {length} символов',
        uppercase: 'Пароль должен содержать хотя бы одну заглавную букву',
        digit: 'Пароль должен содержать хотя бы одну цифру',
        special: 'Пароль должен содержать хотя бы один специальный символ',
        pattern: 'Пароль не соответствует требованиям безопасности',
        mismatch: 'Пароли не совпадают',
      },

      fullName: {
        required: 'Укажите полное имя',
        wordsCount: 'Полное имя должно содержать от 2 до 3 слов',
        wordLength: 'Каждое слово должно содержать минимум 3 символа',
        uppercase: 'Каждое слово должно начинаться с заглавной буквы',
        lettersOnly: 'Допускаются только буквы',
        pattern: 'Формат полного имени: Имя Фамилия [Отчество]',
      },

      onlyRussian: 'Допускаются только русские буквы',
      onlyEnglish: 'Допускаются только английские буквы',
    },

    register: {
      title: 'Регистрация',
      registerButton: 'Зарегистрироваться',
      loginButton: 'Уже есть аккаунт? Войти',
      registerError: 'Ошибка при регистрации',
      selectRole: 'Выберите роль',
      roleUser: 'Пользователь',
      roleSeller: 'Продавец',
    },

    serverErrors: {
      emailAlreadyExists: 'Пользователь с таким email уже существует',
    },

    // Добавляем новую секцию для общих сообщений форм
    forms: {
      hasErrors: 'Пожалуйста, исправьте ошибки в форме',
      submitSuccess: 'Данные успешно отправлены',
      submitError: 'Ошибка при отправке данных',
    },
  },

  en: {
    paymentStatus: {
      Pending: 'Pending',
      WaitingForCapture: 'Waiting for capture',
      Succeeded: 'Succeeded',
      Canceled: 'Canceled',
      Failed: 'Failed',
    },
    ticketStatus: {
      Available: 'Available',
      Reserved: 'Reserved',
      Paid: 'Paid',
      Used: 'Used',
      Cancelled: 'Cancelled',
    },
    basePagination: {
      show: 'Show',
      prev: 'Previous',
      next: 'Next',
    },
    filters: {
      select: 'Select',
      search: 'Search',
      apply: 'Apply',
      reset: 'Reset',
      from: 'From',
      to: 'To',
      selectDate: 'Select date',
    },
    datePicker: {
      selectDate: 'Select date',
      selectDateRange: 'Select date range',
      time: 'Time',
      startTime: 'Start time',
      endTime: 'End time',
      from: 'From',
      to: 'To',
      apply: 'Apply',
      clear: 'Clear',
    },
    formatter: {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      weekdayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      currency: {
        RUB: '₽',
        USD: '$',
        EUR: '€',
      },
    },

    // Добавляем новые группы локализаций
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      confirmPassword: 'Confirm password',
      role: 'Role',
      user: 'User',
      seller: 'Seller',
      fullName: 'Full Name',
    },

    validation: {
      required: 'Required field',
      minLength: 'Minimum {length} characters',
      maxLength: 'Maximum {length} characters',
      pattern: 'Invalid format',

      name: {
        required: 'Please enter your name',
        minLength: 'Name must contain at least 3 characters',
        maxLength: 'Name must contain at most 50 characters',
        uppercase: 'Name must start with an uppercase letter',
        pattern: 'Only letters are allowed',
      },

      lastName: {
        required: 'Please enter your last name',
        minLength: 'Last name must contain at least 3 characters',
        maxLength: 'Last name must contain at most 50 characters',
        uppercase: 'Last name must start with an uppercase letter',
        pattern: 'Only letters are allowed',
      },

      email: {
        required: 'Please enter your email',
        invalid: 'Invalid email format',
      },

      phone: {
        required: 'Please enter your phone number',
        pattern: 'Invalid phone number format',
      },

      password: {
        required: 'Please enter a password',
        confirmRequired: 'Please confirm your password',
        minLength: 'Password must contain at least {length} characters',
        uppercase: 'Password must contain at least one uppercase letter',
        digit: 'Password must contain at least one digit',
        special: 'Password must contain at least one special character',
        pattern: 'Password does not meet security requirements',
        mismatch: 'Passwords do not match',
      },

      fullName: {
        required: 'Please enter your full name',
        wordsCount: 'Full name must contain 2 to 3 words',
        wordLength: 'Each word must contain at least 3 characters',
        uppercase: 'Each word must start with an uppercase letter',
        lettersOnly: 'Only letters are allowed',
        pattern: 'Full name format: First Last [Middle]',
      },

      onlyRussian: 'Only Russian letters are allowed',
      onlyEnglish: 'Only English letters are allowed',
    },

    register: {
      title: 'Registration',
      registerButton: 'Register',
      loginButton: 'Already have an account? Log in',
      registerError: 'Registration error',
      selectRole: 'Select role',
      roleUser: 'User',
      roleSeller: 'Seller',
    },

    serverErrors: {
      emailAlreadyExists: 'User with this email already exists',
    },

    // Добавляем новую секцию для общих сообщений форм на английском
    forms: {
      hasErrors: 'Please fix the errors in the form',
      submitSuccess: 'Data submitted successfully',
      submitError: 'Error submitting data',
    },
  },
}

const i18n = createI18n({
  legacy: false, // Использовать Composition API
  locale: 'ru', // По умолчанию русский
  fallbackLocale: 'en',
  messages,
})

export default i18n
