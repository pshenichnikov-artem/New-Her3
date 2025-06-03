import { all } from "axios";
import { stat } from "fs";

export default {
  // UI элементы
  ui: {
    // Состояния
    states: {
      loading: 'Загрузка...',
      success: 'Успешно',
      error: 'Ошибка',
      empty: 'Нет данных',
    },

    // Действия и кнопки (объединены)
    actions: {
      // Общие действия
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      apply: 'Применить',
      reset: 'Сбросить',
      search: 'Поиск',
      select: 'Выбрать',
      clear: 'Очистить',
      submit: 'Отправить',
      confirm: 'Подтвердить',

      // Кнопки аутентификации
      login: 'Войти',
      register: 'Зарегистрироваться',
      logout: 'Выйти',
      goToLogin: 'Уже есть аккаунт? Войти',
      goToRegister: 'Зарегистрироваться',
      forgotPassword: 'Забыли пароль?',
      changePassword: 'Изменить пароль',

      // Навигационные действия
      goBack: 'Назад',
      goForward: 'Вперёд',
      returnHome: 'Вернуться на главную',

      // Фильтры и сортировка
      filter: 'Фильтровать',
      sort: 'Сортировать',
      showFilters: 'Показать фильтры',
      hideFilters: 'Скрыть фильтры',

      // Работа с датами
      selectDate: 'Выбрать дату',
      setDateRange: 'Установить диапазон дат',
    },

    // Пагинация (объединена)
    pagination: {
      show: 'Показать',
      prev: 'Назад',
      next: 'Вперёд',
      page: 'Страница',
      of: 'из',
      perPage: 'На странице',
    },
  },

  // Поля форм (объединены)
  fields: {
    // Пользовательские поля
    firstName: 'Имя',
    lastName: 'Фамилия',
    fullName: 'Полное имя',
    email: 'Email',
    phone: 'Телефон',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    oldPassword: 'Текущий пароль',
    newPassword: 'Новый пароль',
    role: 'Роль',
    birthDate: 'Дата рождения',
    documentType: 'Тип документа',
    documentNumber: 'Номер документа',

    // Поля событий
    title: 'Название',
    description: 'Описание',
    location: 'Место проведения',
    date: 'Дата',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    time: 'Время',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    price: 'Цена',
    minPrice: 'Цена от',
    maxPrice: 'Цена до',
    ticketCount: 'Количество билетов',

    // Плейсхолдеры
    placeholders: {
      search: 'Поиск...',
      title: 'Введите название...',
      location: 'Введите место проведения...',
      dateRange: 'Выберите диапазон дат',
      minPrice: 'Минимум',
      maxPrice: 'Максимум',
      email: 'example@email.com',
      phone: '+7 (XXX) XXX-XX-XX',
    },
  },

  // Типы документов
  documentTypes: {
    passport: 'Паспорт РФ',
    driverLicense: 'Водительское удостоверение',
    studentCard: 'Студенческий билет',
  },

  // Валидация
  validation: {
    // Общие сообщения
    required: 'Обязательное поле',
    minLength: 'Минимум {length} символов',
    maxLength: 'Максимум {length} символов',
    pattern: 'Неверный формат',

    // Специфичные валидации
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

    document: {
      passport: 'Введите корректный номер паспорта (10 цифр, например: 1234 567890)',
      driverLicense: 'Введите корректный номер водительского удостоверения (10 цифр)',
      studentCard: 'Введите корректный номер студенческого билета',
    },

    // Ограничения по языку
    onlyRussian: 'Допускаются только русские буквы',
    onlyEnglish: 'Допускаются только английские буквы',

    // Дополнительные валидации
    maxDate: 'Дата не может быть в будущем',
  },

  // Ошибки (объединены)
  errors: {
    // Общие ошибки
    general: 'Произошла ошибка',
    unexpected: 'Непредвиденная ошибка',
    formHasErrors: 'Пожалуйста, исправьте ошибки в форме',
    submitError: 'Ошибка при отправке данных',
    operationFailed: 'Не удалось выполнить операцию',
    networkError:
      'Не удалось подключиться к серверу. Проверьте подключение к Интернету или попробуйте позже',
    notFound: 'Ресурс не найден',
    serverError: 'Ошибка сервера',
    badRequest: 'Неверный запрос',

    // Ошибки аутентификации
    auth: {
      emailAlreadyExists: 'Пользователь с таким email уже существует',
      invalidCredentials: 'Неверный email или пароль',
      unauthorized: 'Требуется авторизация',
      forbidden: 'Доступ запрещен',
      sessionExpired: 'Сессия истекла, войдите снова',
      loginError: 'Ошибка при входе',
      registerError: 'Ошибка при регистрации',
      passwordChangeError: 'Не удалось изменить пароль',
    },

    // Ошибки сущностей
    entities: {
      event: {
        notFound: 'Событие не найдено',
        alreadyExists: 'Событие с таким названием уже существует',
        loadError: 'Ошибка при загрузке событий',
        createError: 'Ошибка при создании события',
        updateError: 'Ошибка при обновлении события',
        deleteError: 'Ошибка при удалении события',
      },
      user: {
        notFound: 'Пользователь не найден',
        loadError: 'Ошибка при загрузке пользователей',
        updateError: 'Ошибка при обновлении пользователя',
        deleteError: 'Ошибка при удалении пользователя',
      },
      ticket: {
        notFound: 'Билет не найден',
        loadError: 'Ошибка при загрузке билетов',
        createError: 'Ошибка при создании билета',
        updateError: 'Ошибка при обновлении билета',
        deleteError: 'Ошибка при удалении билета',
        reserveError: 'Ошибка при бронировании билета',
        alreadyReserved: 'Этот билет уже забронирован',
        alreadyPaid: 'Этот билет уже оплачен',
        alreadyUsed: 'Этот билет уже использован',
      },
      payment: {
        notFound: 'Платеж не найден',
        loadError: 'Ошибка при загрузке платежей',
        createError: 'Ошибка при создании платежа',
        updateError: 'Ошибка при обновлении платежа',
        deleteError: 'Ошибка при удалении платежа',
        paymentFailed: 'Ошибка при оплате',
      },
      image: {
        notFound: 'Изображение не найдено',
        loadError: 'Ошибка при загрузке изображений',
        uploadError: 'Ошибка при загрузке изображения',
        updateError: 'Ошибка при обновлении изображения',
        deleteError: 'Ошибка при удалении изображения',
        invalidFileType: 'Неверный тип файла. Поддерживаются только изображения',
        fileSizeExceeded: 'Размер файла превышает допустимый',
      },
      calendar: {
        notFound: 'Календарь не найден',
        eventNotFound: 'Событие в календаре не найдено',
        loadError: 'Ошибка при загрузке календаря',
        addError: 'Ошибка при добавлении события в календарь',
        updateError: 'Ошибка при обновлении события в календаре',
        deleteError: 'Ошибка при удалении события из календаря',
      },
      attendee: {
        notFound: 'Участник не найден',
        loadError: 'Не удалось загрузить участников',
      },
    },
  },

  // Сообщения успеха (объединены)
  success: {
    // Общие сообщения
    submitSuccess: 'Данные успешно отправлены',
    operationSuccess: 'Операция выполнена успешно',

    // Аутентификация
    auth: {
      loginSuccess: 'Вы успешно вошли в систему',
      registerSuccess: 'Регистрация успешно завершена',
      passwordChanged: 'Пароль успешно изменен',
      logoutSuccess: 'Вы вышли из системы',
    },

    // Успешные операции с сущностями
    entities: {
      event: {
        createSuccess: 'Событие успешно создано',
        updateSuccess: 'Событие обновлено',
        deleteSuccess: 'Событие удалено',
      },
      user: {
        updateSuccess: 'Данные пользователя обновлены',
        deleteSuccess: 'Пользователь удален',
        profileUpdated: 'Профиль успешно обновлен',
        accountDeleted: 'Аккаунт успешно удален',
      },
      ticket: {
        createSuccess: 'Билет успешно создан',
        updateSuccess: 'Билет успешно обновлен',
        deleteSuccess: 'Билет удален',
        reserveSuccess: 'Билет успешно забронирован',
      },
      payment: {
        createSuccess: 'Платеж успешно создан',
        updateSuccess: 'Платеж обновлен',
        deleteSuccess: 'Платеж удален',
        paymentSuccessful: 'Оплата успешно выполнена',
      },
      image: {
        uploadSuccess: 'Изображение успешно загружено',
        updateSuccess: 'Изображение обновлено',
        deleteSuccess: 'Изображение удалено',
      },
      calendar: {
        eventAddSuccess: 'Событие успешно добавлено в календарь',
        eventUpdateSuccess: 'Событие в календаре обновлено',
        eventDeleteSuccess: 'Событие удалено из календаря',
      },
      attendee: {
        createSuccess: 'Участник успешно добавлен',
        updateSuccess: 'Данные участника обновлены',
        deleteSuccess: 'Участник удален',
      },
    },
  },

  // Статусы (объединены)
  statuses: {
    // Платежи
    payment: {
      Pending: 'Ожидание оплаты',
      WaitingForCapture: 'Ожидание подтверждения',
      Succeeded: 'Оплачено',
      Canceled: 'Отменено',
      Failed: 'Ошибка оплаты',
      awaitingPayment: 'Ожидание платежа',
      paymentCanceled: 'Платеж отменен',
    },

    // Билеты
    ticket: {
      Available: 'Доступен',
      Reserved: 'Забронирован',
      Paid: 'Оплачен',
      Used: 'Использован',
      Cancelled: 'Отменён',
    },
  },

  // Модули приложения
  modules: {
    // Страницы и заголовки
    pages: {
      home: 'Главная',
      login: 'Вход',
      register: 'Регистрация',
      profile: 'Профиль',
      events: 'Мероприятия',
      eventDetails: 'Детали мероприятия',
      createEvent: 'Создание мероприятия',
      tickets: 'Билеты',
      dashboard: 'Панель управления',
    },

    // Аутентификация
    auth: {
      title: {
        login: 'Вход в систему',
        register: 'Регистрация',
        changePassword: 'Изменение пароля',
      },
      termsAgreement: 'Я принимаю условия использования',
      unauthenticated: 'Необходимо войти в систему',
    },

    // Фильтры и сортировка
    filters: {
      title: 'Название',
      titlePlaceholder: 'Поиск по названию',
      location: 'Местоположение',
      locationPlaceholder: 'Поиск по местоположению',
      dateRange: 'Период',
      dateRangePlaceholder: 'Выберите даты',
      tag: 'Категория',
      allTags: 'Все категории',
      minPrice: 'Цена от',
      minPricePlaceholder: 'Минимум',
      maxPrice: 'Цена до',
      maxPricePlaceholder: 'Максимум',
      onlyActive: 'Только активные',
      reset: 'Сбросить',
      apply: 'Применить',
      select: 'Выбрать',
      search: 'Поиск',
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

    // События
    events: {
      title: 'Мероприятия',
      inactive: 'Неактивно',
      free: 'Бесплатно',
      moreDetails: 'Подробнее',
      buyTicket: 'Купить',
      found: '{count} мероприятий найдено',
      noEvents: 'Мероприятия не найдены',
      tryDifferentFilters: 'Попробуйте изменить параметры поиска',
      time: {
        hours: 'ч',
        minutes: 'мин',
        duration: 'Длительность',
      },
      tags: {
        concert: 'Концерт',
        festival: 'Фестиваль',
        exhibition: 'Выставка',
        theater: 'Театр',
        sport: 'Спорт',
        workshop: 'Мастер-класс',
        other: 'Другое',
      },
      filters: {
        title: 'Название',
        titlePlaceholder: 'Поиск по названию',
        location: 'Местоположение',
        locationPlaceholder: 'Поиск по местоположению',
        dateRange: 'Период',
        dateRangePlaceholder: 'Выберите даты',
        tag: 'Категория',
        allTags: 'Все категории',
        minPrice: 'Цена от',
        minPricePlaceholder: 'Минимум',
        maxPrice: 'Цена до',
        maxPricePlaceholder: 'Максимум',
        onlyActive: 'Только активные',
        reset: 'Сбросить',
        apply: 'Применить',
        showFilters: 'Показать фильтры',
        hideFilters: 'Скрыть фильтры',
      },
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

  // Страницы ошибок
  errorPages: {
    notFound: {
      title: 'Страница не найдена',
      message: 'Извините, запрошенная вами страница не существует или была перемещена.',
      returnHome: 'Вернуться на главную',
    },
    unauthorized: {
      title: 'Доступ запрещён',
      message: 'У вас нет прав для доступа к этой странице.',
      returnHome: 'Вернуться на главную',
      logout: 'Выйти',
    },
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

  // Диалоги
  dialogs: {
    confirm: {
      title: 'Подтверждение',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
    },
    deleteConfirmation: {
      title: 'Удаление',
      message: 'Вы уверены, что хотите удалить этот элемент?',
      confirmButton: 'Удалить',
      cancelButton: 'Отмена',
    },
    userDeleteConfirmation:
      'Вы уверены, что хотите удалить свой аккаунт? Это действие невозможно отменить.',
  },

  // Кнопки
  common: {
    buttons: {
      back: 'Назад',
      register: 'Зарегистрироваться',
      goToLogin: 'Войти',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
    errors: {
      error: 'Ошибка',
      formHasErrors: 'Пожалуйста, исправьте ошибки в форме',
      networkError: 'Ошибка сети',
    },
    success: {
      registerSuccess: 'Регистрация успешно завершена',
    },
    language: 'Язык',
    yes: 'Да',
    no: 'Нет',
    changesDiscarded: 'Изменения отменены',
  },

  // Билеты
  tickets: {
    price: 'Цена',
    duration: 'Длительность',
    purchase: {
      title: 'Покупка билетов',
      description: 'Заполните информацию для каждого билета',
      ticket: 'Билет',
      ticketsCount: '{count} билет(ов)',
      maxTickets: 'Максимум {max} билетов за один заказ',
      submit: 'Купить {count} билет(ов) за {price}',
      success: 'Вы успешно приобрели {count} билет(ов)',
      error: 'Ошибка при покупке билетов',
      noAvailableTickets: 'Нет доступных билетов',
      reserveError: 'Ошибка бронирования билета',
    },
  },

  // Профиль пользователя
  profile: {
    title: 'Личный кабинет',
    menu: {
      info: 'Мой профиль',
      tickets: 'Мои билеты',
      calendar: 'Мой календарь',
    },
    info: {
      title: 'Информация о профиле',
      editProfile: 'Редактировать профиль',
      changePassword: 'Сменить пароль',
      saveChanges: 'Сохранить изменения',
      cancel: 'Отмена',
      updateSuccess: 'Профиль успешно обновлен',
      updateError: 'Ошибка при обновлении профиля',
    },
    password: {
      title: 'Сменить пароль',
      change: 'Сменить пароль',
      success: 'Пароль успешно изменен',
      error: 'Ошибка при смене пароля',
    },
    tickets: {
      title: 'Мои билеты',
      comingSoon: 'Список ваших билетов будет доступен скоро!',
      noTickets: 'У вас пока нет билетов',
      buyTicketsMessage: 'Посетите страницу с мероприятиями, чтобы приобрести билеты',
      browseEvents: 'Просмотреть мероприятия',
      filter: 'Фильтр',
      allStatuses: 'Все статусы',
      sort: 'Сортировка',
      sortNewest: 'Сначала новые',
      sortOldest: 'Сначала старые',
      sortByEvent: 'По названию мероприятия',
      ticketDetails: 'Детали билета',
      eventDetails: 'Информация о мероприятии',
      attendeeDetails: 'Информация о посетителе',
      view: 'Просмотр',
      download: 'Скачать',
      downloadStarted: 'Загрузка билета началась',
      unknownEvent: 'Неизвестное мероприятие',
      locationUnknown: 'Место проведения не указано',
      attendeeUnknown: 'Посетитель не указан',
      ticketStatus: 'Статус билета',
    },
    calendar: {
      title: 'Мой календарь событий',
      comingSoon: 'Календарь событий будет доступен скоро!',
    },
  },

  // Пользователи
  user: {
    roles: {
      admin: 'Администратор',
      user: 'Пользователь',
      unknown: 'Неизвестная роль',
    },
    id: 'Идентификатор',
    fullName: 'Полное имя',
    email: 'Email',
    role: 'Роль',
    phone: 'Телефон',
    birthDate: 'Дата рождения',

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
    mainSite: 'На главный сайт',
  },

  //Дашборд
  dashboard: {
    title: 'Панель управления',
    menu: {
      events: 'Мероприятия',
      users: 'Пользователи',
      tickets: 'Билеты',
      pages: 'Страницы',
      attendees: 'Посетители',
      home: 'Главная',
      logout: 'Выйти',
    },
  },

  // Пагинация
  basePagination: {
    show: 'Показать',
    prev: 'Назад',
    next: 'Вперед',
  },

  // AdminDataTable
  adminDataTable: {
    applyFilters: 'Применить фильтры',
    resetFilters: 'Сбросить фильтры',
    noData: 'Нет данных для отображения',
    loading: 'Загрузка данных...',
    error: 'Ошибка при загрузке данных',
    noDataDescription: 'Пожалуйста, проверьте фильтры или добавьте новые данные.',
    add: 'Добавить',
  },

  //События
  event: {
    id: 'Идентификатор',
    title: 'Мероприятие',
    startTime: 'Начало',
    endTime: 'Окончание',
    location: 'Место проведения',
    description: 'Описание',
    tags: 'Категории',
    price: 'Цена',
    active: 'Активное событие',
    edit: 'Редактировать событие',
    fields: {
      title: 'Название мероприятия',
      description: 'Описание мероприятия',
      location: 'Место проведения',
      startDate: 'Дата начала',
      endDate: 'Дата окончания',
      tag: 'Категории',
      price: 'Цена',
      ticketsCount: 'Количество билетов',
      isActive: 'Активное событие',
      images: 'Изображения',
    },
    addImage: 'Добавить изображение',
    updateFailed: 'Не удалось обновить данные',
  },

  //Билеты
  ticket: {
    id: 'Идентификатор',
    eventId: 'Идентификатор мероприятия',
    buyerName: 'Имя покупателя',
    attendeeName: 'Имя посетителя',
    status: {
      title: 'Статус',
    }
  },

  //Фильтры в дашборде
  filters: {
    event: {
      title: 'Название мероприятия',
      location: 'Место проведения',
      tag: 'Категории',
      dateRange: 'Период проведения',
      minPrice: 'Цена от',
      maxPrice: 'Цена до',
      active: 'Активное событие',
    },
    user: {
      fullName: 'Полное имя',
      email: 'Email',
      role: 'Роль',
      phone: 'Телефон',
      birthDate: 'Дата рождения',
      createdAt: 'Дата регистрации',
    },
    ticket: {
      buyerName: 'Имя покупателя',
      attendeeName: 'Имя посетителя',
      status: 'Статус билета',
      eventId: 'Идентификатор мероприятия',
      buyerId: 'Идентификатор покупателя',
      attendeeId: 'Идентификатор посетителя',
      paymentId: 'Идентификатор платежа',
    },
    all: 'Все',
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

}
