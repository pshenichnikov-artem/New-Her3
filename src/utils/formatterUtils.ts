/**
 * Форматирует дату для отображения (без учета локали)
 * @param date Дата для форматирования
 * @returns Отформатированная дата (YYYY-MM-DD)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString().slice(0, 10)
}

/**
 * Форматирует время для отображения (без учета локали)
 * @param date Дата для форматирования времени
 * @param includeSeconds Включать ли секунды в форматировании
 * @returns Отформатированное время (HH:MM[:SS])
 */
export function formatTime(date: Date | string | null, includeSeconds: boolean = false): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const seconds = dateObj.getSeconds().toString().padStart(2, '0')
  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
}

/**
 * Форматирует дату и время для отображения (без учета локали)
 * @param date Дата для форматирования
 * @param includeSeconds Включать ли секунды
 * @returns Отформатированная дата и время (YYYY-MM-DD HH:MM[:SS])
 */
export function formatDateTime(
  date: Date | string | null,
  includeSeconds: boolean = false,
): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const dateStr = dateObj.toISOString().slice(0, 10)
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const seconds = dateObj.getSeconds().toString().padStart(2, '0')
  return includeSeconds
    ? `${dateStr} ${hours}:${minutes}:${seconds}`
    : `${dateStr} ${hours}:${minutes}`
}

/**
 * Форматирует дату для отправки на сервер в формате ISO
 * @param date Дата для форматирования
 * @returns Отформатированная дата для сервера
 */
export function formatDateForServer(date: Date | null): string {
  if (!date) return ''
  return date.toISOString()
}

/**
 * Форматирует число с разделителями (без учета локали)
 * @param value Число для форматирования
 * @returns Отформатированное число в виде строки
 */
export function formatNumber(value: number | string | null): string {
  if (value === null || value === undefined || value === '') return ''
  const numberValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numberValue)) return ''
  return numberValue.toString()
}

/**
 * Форматирует валюту (без учета локали)
 * @param value Значение
 * @param currencyCode Код валюты (например, 'RUB', 'USD')
 * @returns Отформатированная валюта
 */
export function formatCurrency(
  value: number | string | null,
  currencyCode: string = 'RUB',
): string {
  if (value === null || value === undefined || value === '') return ''
  const numberValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numberValue)) return ''
  return `${numberValue.toFixed(2)} ${currencyCode}`
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

import { useI18n } from 'vue-i18n'
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
