import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    // Общие элементы интерфейса
    common: {
      // Состояния
      states: {
        loading: 'Загрузка...',
        success: 'Успешно',
        error: 'Ошибка',
      },
      // Действия
      actions: {
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        edit: 'Редактировать',
        apply: 'Применить',
        reset: 'Сбросить',
        search: 'Поиск',
        select: 'Выбрать',
        clear: 'Очистить',
      },
      // Кнопки
      buttons: {
        submit: 'Отправить',
        login: 'Войти',
        register: 'Зарегистрироваться',
        goToLogin: 'Уже есть аккаунт? Войти',
        goToRegister: 'Зарегистрироваться',
      },
      // Ошибки
      errors: {
        general: 'Произошла ошибка',
        unexpected: 'Непредвиденная ошибка',
        formHasErrors: 'Пожалуйста, исправьте ошибки в форме',
        submitError: 'Ошибка при отправке данных',
        operationFailed: 'Не удалось выполнить операцию',
      },
      // Сообщения об успехе
      success: {
        submitSuccess: 'Данные успешно отправлены',
        loginSuccess: 'Вы успешно вошли в систему',
        registerSuccess: 'Регистрация успешно завершена',
        operationSuccess: 'Операция выполнена успешно',
      },
    },

    // Названия страниц
    pages: {
      home: 'Главная',
      login: 'Вход',
      register: 'Регистрация',
      profile: 'Профиль',
      events: 'Мероприятия',
      eventDetails: 'Детали мероприятия',
      createEvent: 'Создание мероприятия',
      tickets: 'Билеты',
    },

    // Поля форм
    fields: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      fullName: 'Полное имя',
      email: 'Email',
      phone: 'Телефон',
      password: 'Пароль',
      confirmPassword: 'Подтверждение пароля',
      role: 'Роль',
      user: 'Пользователь',
      seller: 'Продавец',
      // Поля событий
      title: 'Название',
      description: 'Описание',
      location: 'Место проведения',
      date: 'Дата',
      startDate: 'Дата начала',
      endDate: 'Дата окончания',
      ticketCount: 'Количество билетов',
    },

    // Валидация полей
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

      fullName: {
        required: 'Укажите полное имя',
        wordsCount: 'Полное имя должно содержать от 2 до 3 слов',
        wordLength: 'Каждое слово должно содержать минимум 3 символа',
        uppercase: 'Каждое слово должно начинаться с заглавной буквы',
        lettersOnly: 'Допускаются только буквы',
        pattern: 'Формат полного имени: Имя Фамилия [Отчество]',
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

      onlyRussian: 'Допускаются только русские буквы',
      onlyEnglish: 'Допускаются только английские буквы',
    },

    // Ошибки с сервера
    serverErrors: {
      // Аутентификация
      auth: {
        emailAlreadyExists: 'Пользователь с таким email уже существует',
        invalidCredentials: 'Неверный email или пароль',
        unauthorized: 'Требуется авторизация',
        forbidden: 'Доступ запрещен',
      },
      // Общие
      common: {
        notFound: 'Ресурс не найден',
        serverError: 'Ошибка сервера',
        badRequest: 'Неверный запрос',
      },
      // События
      events: {
        notFound: 'Событие не найдено',
        alreadyExists: 'Событие с таким названием уже существует',
      },
    },

    // Авторизация
    auth: {
      login: {
        error: 'Ошибка при входе',
      },
      register: {
        error: 'Ошибка при регистрации',
      },
    },

    // Статусы платежей
    paymentStatus: {
      Pending: 'Ожидание оплаты',
      WaitingForCapture: 'Ожидание подтверждения',
      Succeeded: 'Оплачено',
      Canceled: 'Отменено',
      Failed: 'Ошибка оплаты',
    },

    // Статусы билетов
    ticketStatus: {
      Available: 'Доступен',
      Reserved: 'Забронирован',
      Paid: 'Оплачен',
      Used: 'Использован',
      Cancelled: 'Отменён',
    },

    // Компоненты навигации
    navigation: {
      // Пагинация
      pagination: {
        show: 'Показать',
        prev: 'Назад',
        next: 'Вперёд',
      },
    },

    // Фильтрация и сортировка
    filters: {
      select: 'Выбрать',
      search: 'Поиск',
      apply: 'Применить',
      reset: 'Сбросить',
      from: 'От',
      to: 'До',
      selectDate: 'Выберите дату',
    },

    // Компонент выбора даты
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

    // Форматирование
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
  },

  en: {
    // Common UI elements
    common: {
      // States
      states: {
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
      },
      // Actions
      actions: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        apply: 'Apply',
        reset: 'Reset',
        search: 'Search',
        select: 'Select',
        clear: 'Clear',
      },
      // Buttons
      buttons: {
        submit: 'Submit',
        login: 'Login',
        register: 'Register',
        goToLogin: 'Already have an account? Log in',
        goToRegister: 'Register',
      },
      // Errors
      errors: {
        general: 'An error occurred',
        unexpected: 'Unexpected error',
        formHasErrors: 'Please fix the errors in the form',
        submitError: 'Error submitting data',
        operationFailed: 'Failed to perform operation',
      },
      // Success messages
      success: {
        submitSuccess: 'Data submitted successfully',
        loginSuccess: 'You have successfully logged in',
        registerSuccess: 'Registration completed successfully',
        operationSuccess: 'Operation completed successfully',
      },
    },

    // Page titles
    pages: {
      home: 'Home',
      login: 'Login',
      register: 'Registration',
      profile: 'Profile',
      events: 'Events',
      eventDetails: 'Event details',
      createEvent: 'Create event',
      tickets: 'Tickets',
    },

    // Form fields
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      confirmPassword: 'Confirm password',
      role: 'Role',
      user: 'User',
      seller: 'Seller',
      // Event fields
      title: 'Title',
      description: 'Description',
      location: 'Location',
      date: 'Date',
      startDate: 'Start date',
      endDate: 'End date',
      ticketCount: 'Ticket count',
    },

    // Field validation
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

      fullName: {
        required: 'Please enter your full name',
        wordsCount: 'Full name must contain 2 to 3 words',
        wordLength: 'Each word must contain at least 3 characters',
        uppercase: 'Each word must start with an uppercase letter',
        lettersOnly: 'Only letters are allowed',
        pattern: 'Full name format: First Last [Middle]',
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

      onlyRussian: 'Only Russian letters are allowed',
      onlyEnglish: 'Only English letters are allowed',
    },

    // Server errors
    serverErrors: {
      // Authentication
      auth: {
        emailAlreadyExists: 'User with this email already exists',
        invalidCredentials: 'Invalid email or password',
        unauthorized: 'Authentication required',
        forbidden: 'Access denied',
      },
      // Common
      common: {
        notFound: 'Resource not found',
        serverError: 'Server error',
        badRequest: 'Bad request',
      },
      // Events
      events: {
        notFound: 'Event not found',
        alreadyExists: 'Event with this title already exists',
      },
    },

    // Authentication
    auth: {
      login: {
        error: 'Login error',
      },
      register: {
        error: 'Registration error',
      },
    },

    // Payment statuses
    paymentStatus: {
      Pending: 'Pending',
      WaitingForCapture: 'Waiting for capture',
      Succeeded: 'Succeeded',
      Canceled: 'Canceled',
      Failed: 'Failed',
    },

    // Ticket statuses
    ticketStatus: {
      Available: 'Available',
      Reserved: 'Reserved',
      Paid: 'Paid',
      Used: 'Used',
      Cancelled: 'Cancelled',
    },

    // Navigation components
    navigation: {
      // Pagination
      pagination: {
        show: 'Show',
        prev: 'Previous',
        next: 'Next',
      },
    },

    // Filtering and sorting
    filters: {
      select: 'Select',
      search: 'Search',
      apply: 'Apply',
      reset: 'Reset',
      from: 'From',
      to: 'To',
      selectDate: 'Select date',
    },

    // Date picker component
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

    // Formatting
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
  },
}

const i18n = createI18n({
  legacy: false, // Использовать Composition API
  locale: 'ru', // По умолчанию русский
  fallbackLocale: 'en',
  messages,
})

export default i18n
