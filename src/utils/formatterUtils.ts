import { useI18n } from 'vue-i18n'

/**
 * Форматирует дату для отображения с учетом локализации
 * @param date Дата для форматирования
 * @param locale Локаль для форматирования (если не указана, используется текущая из i18n)
 * @returns Отформатированная дата
 */
export function formatDate(date: Date | string | null, locale?: string): string {
  if (!date) return ''

  const { locale: currentLocale } = useI18n()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const localeToUse = locale || currentLocale.value

  return new Intl.DateTimeFormat(localeToUse).format(dateObj)
}

/**
 * Форматирует время для отображения
 * @param date Дата для форматирования времени
 * @param includeSeconds Включать ли секунды в форматировании
 * @param locale Локаль для форматирования (если не указана, используется текущая из i18n)
 * @returns Отформатированное время
 */
export function formatTime(
  date: Date | string | null,
  includeSeconds: boolean = false,
  locale?: string,
): string {
  if (!date) return ''

  const { locale: currentLocale } = useI18n()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const localeToUse = locale || currentLocale.value

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
  }

  return new Intl.DateTimeFormat(localeToUse, options).format(dateObj)
}

/**
 * Форматирует дату и время для отображения
 * @param date Дата для форматирования
 * @param includeSeconds Включать ли секунды
 * @param locale Локаль для форматирования
 * @returns Отформатированная дата и время
 */
export function formatDateTime(
  date: Date | string | null,
  includeSeconds: boolean = false,
  locale?: string,
): string {
  if (!date) return ''

  const { locale: currentLocale } = useI18n()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const localeToUse = locale || currentLocale.value

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
  }

  return new Intl.DateTimeFormat(localeToUse, options).format(dateObj)
}

/**
 * Форматирует дату для отправки на сервер в формате "YYYY-MM-DD HH:MM:SS"
 * @param date Дата для форматирования
 * @returns Отформатированная дата для сервера
 */
export function formatDateForServer(date: Date | null): string {
  if (!date) return ''

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Форматирует число с разделителями
 * @param value Число для форматирования
 * @param locale Локаль для форматирования
 * @param options Дополнительные опции форматирования
 * @returns Отформатированное число в виде строки
 */
export function formatNumber(
  value: number | string | null,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  if (value === null || value === undefined || value === '') return ''

  const { locale: currentLocale } = useI18n()
  const localeToUse = locale || currentLocale.value
  const numberValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numberValue)) return ''

  return new Intl.NumberFormat(localeToUse, options).format(numberValue)
}

/**
 * Форматирует валюту
 * @param value Значение
 * @param currencyCode Код валюты (например, 'RUB', 'USD')
 * @param locale Локаль
 * @returns Отформатированная валюта
 */
export function formatCurrency(
  value: number | string | null,
  currencyCode: string = 'RUB',
  locale?: string,
): string {
  if (value === null || value === undefined || value === '') return ''

  const { locale: currentLocale } = useI18n()
  const localeToUse = locale || currentLocale.value
  const numberValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numberValue)) return ''

  return new Intl.NumberFormat(localeToUse, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numberValue)
}

/**
 * Проверяет, является ли дата сегодняшней
 * @param date Дата для проверки
 * @returns true если дата - сегодняшняя
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return isSameDay(date, today)
}

/**
 * Проверяет, являются ли две даты одним днём
 * @param date1 Первая дата
 * @param date2 Вторая дата
 * @returns true если даты относятся к одному дню
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * Получает массив названий месяцев с учетом локализации
 * @param locale Локаль (если не указана, используется текущая из i18n)
 * @returns Массив локализованных названий месяцев
 */
export function getMonthNames(locale?: string): string[] {
  const { locale: currentLocale } = useI18n()
  const localeToUse = locale || currentLocale.value

  const months = []
  const format = new Intl.DateTimeFormat(localeToUse, { month: 'long' })

  for (let month = 0; month < 12; month++) {
    const date = new Date(2000, month, 1)
    months.push(format.format(date))
  }

  return months
}

/**
 * Получает массив коротких названий дней недели с учетом локализации
 * @param locale Локаль (если не указана, используется текущая из i18n)
 * @returns Массив локализованных названий дней недели начиная с понедельника
 */
export function getWeekdayNames(locale?: string): string[] {
  const { locale: currentLocale } = useI18n()
  const localeToUse = locale || currentLocale.value

  const weekdays = []
  const format = new Intl.DateTimeFormat(localeToUse, { weekday: 'short' })

  // Создаем массив дней недели, начиная с понедельника
  // Date в JS: 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  // Для русского и большинства других языков неделя начинается с понедельника
  for (let i = 1; i <= 7; i++) {
    // 4 января 2021 года - это понедельник (если i=1)
    const date = new Date(2021, 0, 3 + i)
    weekdays.push(format.format(date))
  }

  return weekdays
}

/**
 * Клонирует объект даты
 * @param date Дата для клонирования
 * @returns Новый объект даты с тем же значением
 */
export function cloneDate(date: Date): Date {
  return new Date(date.getTime())
}

/**
 * Форматирует дату для отображения в списке выбранных дат
 * @param date Дата для форматирования
 * @returns Отформатированная дата в коротком формате
 */
export function formatShortDate(date: Date | string | null): string {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
