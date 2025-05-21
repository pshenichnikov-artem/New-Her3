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
        networkError:
          'Не удалось подключиться к серверу. Проверьте подключение к Интернету или попробуйте позже',
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
      passwordChanged: 'Пароль успешно изменен',
      passwordChangeFailed: 'Не удалось изменить пароль',
      logout: 'Вы вышли из системы',
      sessionExpired: 'Сессия истекла, войдите снова',
      unauthenticated: 'Необходимо войти в систему',
      login: {
        error: 'Ошибка при входе',
        title: 'Вход в систему',
        submit: 'Войти',
        forgotPassword: 'Забыли пароль?',
      },
      register: {
        error: 'Ошибка при регистрации',
        title: 'Регистрация',
        submit: 'Зарегистрироваться',
        termsAgreement: 'Я принимаю условия использования',
      },
      changePassword: {
        title: 'Изменение пароля',
        oldPassword: 'Текущий пароль',
        newPassword: 'Новый пароль',
        confirmPassword: 'Подтверждение нового пароля',
        submit: 'Изменить пароль',
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

    // Участники
    attendee: {
      createSuccess: 'Участник успешно добавлен',
      updateSuccess: 'Данные участника обновлены',
      deleteSuccess: 'Участник удален',
      notFound: 'Участник не найден',
      loadError: 'Не удалось загрузить участников',
    },

    // События
    event: {
      createSuccess: 'Событие успешно создано',
      updateSuccess: 'Событие обновлено',
      deleteSuccess: 'Событие удалено',
      notFound: 'Событие не найдено',
      loadError: 'Ошибка при загрузке событий',
      createError: 'Ошибка при создании события',
      updateError: 'Ошибка при обновлении события',
      deleteError: 'Ошибка при удалении события',
    },

    // Изображения
    image: {
      uploadSuccess: 'Изображение успешно загружено',
      updateSuccess: 'Изображение обновлено',
      deleteSuccess: 'Изображение удалено',
      notFound: 'Изображение не найдено',
      loadError: 'Ошибка при загрузке изображений',
      uploadError: 'Ошибка при загрузке изображения',
      updateError: 'Ошибка при обновлении изображения',
      deleteError: 'Ошибка при удалении изображения',
      invalidFileType: 'Неверный тип файла. Поддерживаются только изображения',
      fileSizeExceeded: 'Размер файла превышает допустимый',
    },

    // Платежи
    payment: {
      createSuccess: 'Платеж успешно создан',
      updateSuccess: 'Платеж обновлен',
      deleteSuccess: 'Платеж удален',
      notFound: 'Платеж не найден',
      loadError: 'Ошибка при загрузке платежей',
      createError: 'Ошибка при создании платежа',
      updateError: 'Ошибка при обновлении платежа',
      deleteError: 'Ошибка при удалении платежа',
      paymentSuccessful: 'Оплата успешно выполнена',
      paymentFailed: 'Ошибка при оплате',
      awaitingPayment: 'Ожидание платежа',
      paymentCanceled: 'Платеж отменен',
    },

    // Пользователи
    user: {
      updateSuccess: 'Данные пользователя обновлены',
      deleteSuccess: 'Пользователь удален',
      notFound: 'Пользователь не найден',
      loadError: 'Ошибка при загрузке пользователей',
      updateError: 'Ошибка при обновлении пользователя',
      deleteError: 'Ошибка при удалении пользователя',
      profileUpdated: 'Профиль успешно обновлен',
      accountDeleted: 'Аккаунт успешно удален',
      deleteConfirmation:
        'Вы уверены, что хотите удалить свой аккаунт? Это действие невозможно отменить.',
    },

    // Билеты
    ticket: {
      createSuccess: 'Билет успешно создан',
      updateSuccess: 'Билет успешно обновлен',
      deleteSuccess: 'Билет удален',
      notFound: 'Билет не найден',
      loadError: 'Ошибка при загрузке билетов',
      createError: 'Ошибка при создании билета',
      updateError: 'Ошибка при обновлении билета',
      deleteError: 'Ошибка при удалении билета',
      reserveSuccess: 'Билет успешно забронирован',
      reserveError: 'Ошибка при бронировании билета',
      alreadyReserved: 'Этот билет уже забронирован',
      alreadyPaid: 'Этот билет уже оплачен',
      alreadyUsed: 'Этот билет уже использован',
    },

    // Календарь пользователя
    calendar: {
      eventAddSuccess: 'Событие успешно добавлено в календарь',
      eventUpdateSuccess: 'Событие в календаре обновлено',
      eventDeleteSuccess: 'Событие удалено из календаря',
      notFound: 'Календарь не найден',
      eventNotFound: 'Событие в календаре не найдено',
      loadError: 'Ошибка при загрузке календаря',
      addError: 'Ошибка при добавлении события в календарь',
      updateError: 'Ошибка при обновлении события в календаре',
      deleteError: 'Ошибка при удалении события из календаря',
    },

    // Навигация
    navbar: {
      searchEvents: 'Поиск мероприятий',
      searchHint: 'Быстрый поиск',
      viewAllResults: 'Показать все результаты',
      noResults: 'Мероприятий не найдено',
      events: 'Мероприятия',
      dashboard: 'Панель управления',
      profile: 'Профиль',
      login: 'Войти',
      logout: 'Выйти',
    },

    // Футер
    footer: {
      contacts: {
        title: 'Контакты',
        address: 'Российская Федерация,',
        city: 'г. Москва, ул. Событийная, д. 123',
        general: 'Общие вопросы, сотрудничество и отзывы:',
        support: 'Служба поддержки:',
        website: 'Официальный сайт:',
      },
      hours: {
        title: 'Часы работы',
        summer: 'С мая по сентябрь:',
        summerTime: 'С 08:00 до 24:00',
        summerEntry: 'Вход на территорию возможен до 23:00',
        winter: 'С октября по апрель:',
        winterTime: 'С 09:00 до 22:00',
        winterEntry: 'Вход на территорию возможен до 21:00',
      },
      legal: {
        title: 'Правовая информация',
        fullName:
          'Полное наименование: Автономная некоммерческая организация «Центр событийных мероприятий»',
        shortName: 'Сокращенное наименование: АНО «ЦСМ»',
        address: 'Адрес: 123456, г. Москва, ул. Событийная, д. 123',
        ogrnTitle: 'ОГРН:',
        ogrn: '1234567890123',
        kppTitle: 'КПП:',
        kpp: '123456789',
        innTitle: 'ИНН:',
        inn: '1234567890',
      },
      copyright: 'Все права защищены.',
      allRightsReserved: 'Все права защищены.',
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
        operationFailed: 'Operation failed',
        networkError:
          'Could not connect to server. Check your Internet connection or try again later',
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
      passwordChanged: 'Password changed successfully',
      passwordChangeFailed: 'Failed to change password',
      logout: 'You have been logged out',
      sessionExpired: 'Your session has expired, please log in again',
      unauthenticated: 'Authentication required',
      login: {
        error: 'Login error',
        title: 'Sign In',
        submit: 'Sign In',
        forgotPassword: 'Forgot password?',
      },
      register: {
        error: 'Registration error',
        title: 'Sign Up',
        submit: 'Sign Up',
        termsAgreement: 'I agree to the terms of service',
      },
      changePassword: {
        title: 'Change Password',
        oldPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        submit: 'Change Password',
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

    // Attendees
    attendee: {
      createSuccess: 'Attendee successfully added',
      updateSuccess: 'Attendee data updated',
      deleteSuccess: 'Attendee removed',
      notFound: 'Attendee not found',
      loadError: 'Failed to load attendees',
    },

    // Events
    event: {
      createSuccess: 'Event created successfully',
      updateSuccess: 'Event updated successfully',
      deleteSuccess: 'Event deleted',
      notFound: 'Event not found',
      loadError: 'Failed to load events',
      createError: 'Error creating event',
      updateError: 'Error updating event',
      deleteError: 'Error deleting event',
    },

    // Images
    image: {
      uploadSuccess: 'Image uploaded successfully',
      updateSuccess: 'Image updated successfully',
      deleteSuccess: 'Image deleted',
      notFound: 'Image not found',
      loadError: 'Error loading images',
      uploadError: 'Error uploading image',
      updateError: 'Error updating image',
      deleteError: 'Error deleting image',
      invalidFileType: 'Invalid file type. Only images are supported',
      fileSizeExceeded: 'File size exceeded',
    },

    // Payments
    payment: {
      createSuccess: 'Payment created successfully',
      updateSuccess: 'Payment updated successfully',
      deleteSuccess: 'Payment deleted',
      notFound: 'Payment not found',
      loadError: 'Error loading payments',
      createError: 'Error creating payment',
      updateError: 'Error updating payment',
      deleteError: 'Error deleting payment',
      paymentSuccessful: 'Payment successful',
      paymentFailed: 'Payment failed',
      awaitingPayment: 'Awaiting payment',
      paymentCanceled: 'Payment canceled',
    },

    // Users
    user: {
      updateSuccess: 'User data updated',
      deleteSuccess: 'User deleted',
      notFound: 'User not found',
      loadError: 'Error loading users',
      updateError: 'Error updating user',
      deleteError: 'Error deleting user',
      profileUpdated: 'Profile updated successfully',
      accountDeleted: 'Account deleted successfully',
      deleteConfirmation:
        'Are you sure you want to delete your account? This action cannot be undone.',
    },

    // Tickets
    ticket: {
      createSuccess: 'Ticket created successfully',
      updateSuccess: 'Ticket updated successfully',
      deleteSuccess: 'Ticket deleted',
      notFound: 'Ticket not found',
      loadError: 'Error loading tickets',
      createError: 'Error creating ticket',
      updateError: 'Error updating ticket',
      deleteError: 'Error deleting ticket',
      reserveSuccess: 'Ticket reserved successfully',
      reserveError: 'Error reserving ticket',
      alreadyReserved: 'This ticket is already reserved',
      alreadyPaid: 'This ticket is already paid',
      alreadyUsed: 'This ticket is already used',
    },

    // User calendar
    calendar: {
      eventAddSuccess: 'Event added to calendar successfully',
      eventUpdateSuccess: 'Calendar event updated successfully',
      eventDeleteSuccess: 'Event removed from calendar',
      notFound: 'Calendar not found',
      eventNotFound: 'Calendar event not found',
      loadError: 'Error loading calendar',
      addError: 'Error adding event to calendar',
      updateError: 'Error updating calendar event',
      deleteError: 'Error removing event from calendar',
    },

    // Navigation
    navbar: {
      searchEvents: 'Search events',
      searchHint: 'Quick search',
      viewAllResults: 'View all results',
      noResults: 'No events found',
      events: 'Events',
      dashboard: 'Dashboard',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
    },

    // Footer
    footer: {
      contacts: {
        title: 'Contacts',
        address: 'Russian Federation,',
        city: 'Moscow, 123 Event Street',
        general: 'General inquiries, cooperation and feedback:',
        support: 'Support service:',
        website: 'Official website:',
      },
      hours: {
        title: 'Working Hours',
        summer: 'May to September:',
        summerTime: 'From 8:00 AM to 12:00 AM',
        summerEntry: 'Entrance possible until 11:00 PM',
        winter: 'October to April:',
        winterTime: 'From 9:00 AM to 10:00 PM',
        winterEntry: 'Entrance possible until 9:00 PM',
      },
      legal: {
        title: 'Legal Information',
        fullName: 'Full name: Autonomous Non-profit Organization "Event Center"',
        shortName: 'Short name: ANO "Event Center"',
        address: 'Address: 123456, Moscow, 123 Event Street',
        ogrnTitle: 'OGRN:',
        ogrn: '1234567890123',
        kppTitle: 'KPP:',
        kpp: '123456789',
        innTitle: 'INN:',
        inn: '1234567890',
      },
      copyright: 'All rights reserved.',
      allRightsReserved: 'All rights reserved.',
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
