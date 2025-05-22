export default {
  // UI элементы
  ui: {
    // Состояния
    states: {
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      empty: 'No data',
    },

    // Действия и кнопки (объединены)
    actions: {
      // Общие действия
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      apply: 'Apply',
      reset: 'Reset',
      search: 'Search',
      select: 'Select',
      clear: 'Clear',
      submit: 'Submit',
      confirm: 'Confirm',

      // Кнопки аутентификации
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      goToLogin: 'Already have an account? Log in',
      goToRegister: 'Register',
      forgotPassword: 'Forgot password?',
      changePassword: 'Change Password',

      // Навигационные действия
      goBack: 'Back',
      goForward: 'Forward',
      returnHome: 'Return to Home',

      // Фильтры и сортировка
      filter: 'Filter',
      sort: 'Sort',
      showFilters: 'Show filters',
      hideFilters: 'Hide filters',

      // Работа с датами
      selectDate: 'Select date',
      setDateRange: 'Set date range',
    },

    // Пагинация
    pagination: {
      show: 'Show',
      prev: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      perPage: 'Per page',
    },
  },

  // Поля форм
  fields: {
    // Пользовательские поля
    firstName: 'First name',
    lastName: 'Last name',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm password',
    oldPassword: 'Current password',
    newPassword: 'New password',
    role: 'Role',

    // Поля событий
    title: 'Title',
    description: 'Description',
    location: 'Location',
    date: 'Date',
    startDate: 'Start date',
    endDate: 'End date',
    time: 'Time',
    startTime: 'Start time',
    endTime: 'End time',
    price: 'Price',
    minPrice: 'Price from',
    maxPrice: 'Price to',
    ticketCount: 'Ticket count',

    // Дополнительные поля
    birthDate: 'Date of Birth',
    documentType: 'Document Type',
    documentNumber: 'Document Number',

    // Плейсхолдеры
    placeholders: {
      search: 'Search...',
      title: 'Enter title...',
      location: 'Enter location...',
      dateRange: 'Select date range',
      minPrice: 'Minimum',
      maxPrice: 'Maximum',
      email: 'example@email.com',
      phone: '+1 (XXX) XXX-XXXX',
    },
  },

  // Типы документов
  documentTypes: {
    passport: 'Russian Passport',
    driverLicense: "Driver's License",
    studentCard: 'Student Card',
  },

  // Валидация
  validation: {
    // Общие сообщения
    required: 'Required field',
    minLength: 'Minimum {length} characters',
    maxLength: 'Maximum {length} characters',
    maxDate: 'Date cannot be in the future',
    pattern: 'Invalid format',

    // Специфичные валидации
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

    document: {
      passport: 'Enter a valid passport number (10 digits, example: 1234 567890)',
      driverLicense: "Enter a valid driver's license number (10 digits)",
      studentCard: 'Enter a valid student card number',
    },

    // Ограничения по языку
    onlyRussian: 'Only Russian letters are allowed',
    onlyEnglish: 'Only English letters are allowed',
  },

  // Ошибки
  errors: {
    // Общие ошибки
    general: 'An error occurred',
    unexpected: 'Unexpected error',
    formHasErrors: 'Please fix the errors in the form',
    submitError: 'Error submitting data',
    operationFailed: 'Operation failed',
    networkError: 'Could not connect to server. Check your Internet connection or try again later',
    notFound: 'Resource not found',
    serverError: 'Server error',
    badRequest: 'Bad request',

    // Ошибки аутентификации
    auth: {
      emailAlreadyExists: 'User with this email already exists',
      invalidCredentials: 'Invalid email or password',
      unauthorized: 'Authentication required',
      forbidden: 'Access denied',
      sessionExpired: 'Your session has expired, please log in again',
      loginError: 'Login error',
      registerError: 'Registration error',
      passwordChangeError: 'Failed to change password',
    },

    // Ошибки сущностей
    entities: {
      event: {
        notFound: 'Event not found',
        alreadyExists: 'Event with this title already exists',
        loadError: 'Failed to load events',
        createError: 'Error creating event',
        updateError: 'Error updating event',
        deleteError: 'Error deleting event',
      },
      user: {
        notFound: 'User not found',
        loadError: 'Error loading users',
        updateError: 'Error updating user',
        deleteError: 'Error deleting user',
      },
      ticket: {
        notFound: 'Ticket not found',
        loadError: 'Error loading tickets',
        createError: 'Error creating ticket',
        updateError: 'Error updating ticket',
        deleteError: 'Error deleting ticket',
        reserveError: 'Error reserving ticket',
        alreadyReserved: 'This ticket is already reserved',
        alreadyPaid: 'This ticket is already paid',
        alreadyUsed: 'This ticket is already used',
      },
      payment: {
        notFound: 'Payment not found',
        loadError: 'Error loading payments',
        createError: 'Error creating payment',
        updateError: 'Error updating payment',
        deleteError: 'Error deleting payment',
        paymentFailed: 'Payment failed',
      },
      image: {
        notFound: 'Image not found',
        loadError: 'Error loading images',
        uploadError: 'Error uploading image',
        updateError: 'Error updating image',
        deleteError: 'Error deleting image',
        invalidFileType: 'Invalid file type. Only images are supported',
        fileSizeExceeded: 'File size exceeded',
      },
      calendar: {
        notFound: 'Calendar not found',
        eventNotFound: 'Calendar event not found',
        loadError: 'Error loading calendar',
        addError: 'Error adding event to calendar',
        updateError: 'Error updating calendar event',
        deleteError: 'Error removing event from calendar',
      },
      attendee: {
        notFound: 'Attendee not found',
        loadError: 'Failed to load attendees',
      },
    },
  },

  // Сообщения успеха
  success: {
    // Общие сообщения
    submitSuccess: 'Data submitted successfully',
    operationSuccess: 'Operation completed successfully',

    // Аутентификация
    auth: {
      loginSuccess: 'You have successfully logged in',
      registerSuccess: 'Registration completed successfully',
      passwordChanged: 'Password changed successfully',
      logoutSuccess: 'You have been logged out',
    },

    // Успешные операции с сущностями
    entities: {
      event: {
        createSuccess: 'Event created successfully',
        updateSuccess: 'Event updated successfully',
        deleteSuccess: 'Event deleted',
      },
      user: {
        updateSuccess: 'User data updated',
        deleteSuccess: 'User deleted',
        profileUpdated: 'Profile updated successfully',
        accountDeleted: 'Account deleted successfully',
      },
      ticket: {
        createSuccess: 'Ticket created successfully',
        updateSuccess: 'Ticket updated successfully',
        deleteSuccess: 'Ticket deleted',
        reserveSuccess: 'Ticket reserved successfully',
      },
      payment: {
        createSuccess: 'Payment created successfully',
        updateSuccess: 'Payment updated successfully',
        deleteSuccess: 'Payment deleted',
        paymentSuccessful: 'Payment successful',
      },
      image: {
        uploadSuccess: 'Image uploaded successfully',
        updateSuccess: 'Image updated successfully',
        deleteSuccess: 'Image deleted',
      },
      calendar: {
        eventAddSuccess: 'Event added to calendar successfully',
        eventUpdateSuccess: 'Calendar event updated successfully',
        eventDeleteSuccess: 'Event removed from calendar',
      },
      attendee: {
        createSuccess: 'Attendee successfully added',
        updateSuccess: 'Attendee data updated',
        deleteSuccess: 'Attendee removed',
      },
    },
  },

  // Статусы
  statuses: {
    // Платежи
    payment: {
      Pending: 'Pending',
      WaitingForCapture: 'Waiting for capture',
      Succeeded: 'Succeeded',
      Canceled: 'Canceled',
      Failed: 'Failed',
      awaitingPayment: 'Awaiting payment',
      paymentCanceled: 'Payment canceled',
    },

    // Билеты
    ticket: {
      Available: 'Available',
      Reserved: 'Reserved',
      Paid: 'Paid',
      Used: 'Used',
      Cancelled: 'Cancelled',
    },
  },

  // Модули приложения
  modules: {
    // Страницы и заголовки
    pages: {
      home: 'Home',
      login: 'Login',
      register: 'Registration',
      profile: 'Profile',
      events: 'Events',
      eventDetails: 'Event details',
      createEvent: 'Create event',
      tickets: 'Tickets',
      dashboard: 'Dashboard',
    },

    // Аутентификация
    auth: {
      title: {
        login: 'Sign In',
        register: 'Sign Up',
        changePassword: 'Change Password',
      },
      termsAgreement: 'I agree to the terms of service',
      unauthenticated: 'Authentication required',
    },

    // Фильтры и сортировка
    filters: {
      title: 'Title',
      titlePlaceholder: 'Search by title',
      location: 'Location',
      locationPlaceholder: 'Search by location',
      dateRange: 'Date range',
      dateRangePlaceholder: 'Select dates',
      tag: 'Category',
      allTags: 'All categories',
      minPrice: 'Price from',
      minPricePlaceholder: 'Minimum',
      maxPrice: 'Price to',
      maxPricePlaceholder: 'Maximum',
      onlyActive: 'Only active',
      reset: 'Reset',
      apply: 'Apply',
      select: 'Select',
      search: 'Search',
      from: 'From',
      to: 'To',
      selectDate: 'Select date',
    },

    // Компонент выбора даты
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

    // События
    events: {
      title: 'Events',
      inactive: 'Inactive',
      free: 'Free',
      moreDetails: 'More Details',

      buyTicket: 'Buy Ticket', // Добавляем новый ключ для кнопки покупки
      found: '{count} events found',
      noEvents: 'No events found',
      tryDifferentFilters: 'Try changing your search parameters',
      time: {
        hours: 'h',
        minutes: 'min',
        duration: 'Duration',
      },
      tags: {
        concert: 'Concert',
        festival: 'Festival',
        exhibition: 'Exhibition',
        theater: 'Theater',
        sport: 'Sport',
        workshop: 'Workshop',
        other: 'Other',
      },
      filters: {
        title: 'Title',
        titlePlaceholder: 'Search by title',
        location: 'Location',
        locationPlaceholder: 'Search by location',
        dateRange: 'Date range',
        dateRangePlaceholder: 'Select dates',
        tag: 'Category',
        allTags: 'All categories',
        minPrice: 'Price from',
        minPricePlaceholder: 'Minimum',
        maxPrice: 'Price to',
        maxPricePlaceholder: 'Maximum',
        onlyActive: 'Only active',
        reset: 'Reset',
        apply: 'Apply',
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
      },
    },

    // Навигация
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
      mainSite: 'Main Website',
    },

    // Пагинация
    basePagination: {
      show: 'Show',
      prev: 'Previous',
      next: 'Next',
    },

    // Футер
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

  // Страницы ошибок
  errorPages: {
    notFound: {
      title: 'Page Not Found',
      message: "Sorry, the page you are looking for doesn't exist or has been moved.",
      returnHome: 'Return to Home',
    },
    unauthorized: {
      title: 'Access Denied',
      message: 'You do not have permission to access this page.',
      returnHome: 'Return to Home',
      logout: 'Logout',
    },
  },

  // Форматирование
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

  // Диалоги
  dialogs: {
    confirm: {
      title: 'Confirmation',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    deleteConfirmation: {
      title: 'Delete',
      message: 'Are you sure you want to delete this item?',
      confirmButton: 'Delete',
      cancelButton: 'Cancel',
    },
    userDeleteConfirmation:
      'Are you sure you want to delete your account? This action cannot be undone.',
  },

  // Кнопки
  common: {
    buttons: {
      goBack: 'Back',
      register: 'Sign Up',
      goToLogin: 'Log In',
    },
    errors: {
      error: 'Error',
      formHasErrors: 'Please fix the errors in the form',
    },
    success: {
      registerSuccess: 'Registration completed successfully',
    },
  },

  // Билеты
  tickets: {
    price: 'Price',
    duration: 'Duration',
    purchase: {
      title: 'Purchase Tickets',
      description: 'Fill in information for each ticket',
      ticket: 'Ticket',
      ticketsCount: '{count} ticket(s)',
      maxTickets: 'Maximum {max} tickets per order',
      submit: 'Buy {count} ticket(s) for {price}',
      success: 'You have successfully purchased {count} ticket(s)',
      error: 'Error purchasing tickets',
      noAvailableTickets: 'No tickets available',
      reserveError: 'Error reserving ticket',
    },
  },

  // Профиль пользователя
  profile: {
    title: 'User Profile',
    menu: {
      info: 'My Profile',
      tickets: 'My Tickets',
      calendar: 'My Calendar',
    },
    info: {
      title: 'Profile Information',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      updateSuccess: 'Profile successfully updated',
      updateError: 'Error updating profile',
    },
    password: {
      title: 'Change Password',
      change: 'Change Password',
      success: 'Password successfully changed',
      error: 'Error changing password',
    },
    tickets: {
      title: 'My Tickets',
      comingSoon: 'Your tickets list will be available soon!',
      noTickets: 'You don\'t have any tickets yet',
      buyTicketsMessage: 'Visit the events page to purchase tickets',
      browseEvents: 'Browse Events',
      filter: 'Filter',
      allStatuses: 'All statuses',
      sort: 'Sort',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      sortByEvent: 'By event name',
      ticketDetails: 'Ticket Details',
      eventDetails: 'Event Information',
      attendeeDetails: 'Attendee Information',
      view: 'View',
      download: 'Download',
      downloadStarted: 'Ticket download started',
      unknownEvent: 'Unknown event',
      locationUnknown: 'Location not specified',
      attendeeUnknown: 'Attendee not specified',
      ticketStatus: 'Ticket status',
    },
    calendar: {
      title: 'My Events Calendar',
      comingSoon: 'Events calendar will be available soon!',
    },
  },

  // Users
  user: {
    roles: {
      admin: 'Administrator',
      user: 'User',
      unknown: 'Unknown role',
    },
  },
}
