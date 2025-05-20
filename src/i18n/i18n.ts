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
  },
}

const i18n = createI18n({
  legacy: false, // Использовать Composition API
  locale: 'ru', // По умолчанию русский
  fallbackLocale: 'en',
  messages,
})

export default i18n
