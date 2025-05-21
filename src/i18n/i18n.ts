import { createI18n } from 'vue-i18n'
import ru from './ru'
import en from './en'

const messages = {
  ru,
  en,
}

const i18n = createI18n({
  legacy: false, // Использовать Composition API
  locale: 'ru', // По умолчанию русский
  fallbackLocale: 'en',
  messages,
})

export default i18n
