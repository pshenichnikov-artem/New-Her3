<template>
  <footer class="bg-gray-800 text-white py-8 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Первая колонка: О компании -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ $t('footer.aboutUs.title') }}</h3>
          <p class="text-gray-400 mb-4">{{ $t('footer.aboutUs.description') }}</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Вторая колонка: Полезные ссылки -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ $t('footer.usefulLinks.title') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.home') }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.products') }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.services') }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.about') }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.terms') }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition">{{ $t('footer.usefulLinks.privacy') }}</a>
            </li>
          </ul>
        </div>

        <!-- Третья колонка: Контакты -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ $t('footer.contact.title') }}</h3>
          <ul class="space-y-2">
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">
                <i class="fas fa-map-marker-alt mt-1"></i>
              </span>
              <span class="text-gray-400">{{ $t('footer.contact.address') }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">
                <i class="fas fa-phone mt-1"></i>
              </span>
              <span class="text-gray-400">{{ $t('footer.contact.phone') }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">
                <i class="fas fa-envelope mt-1"></i>
              </span>
              <span class="text-gray-400">{{ $t('footer.contact.email') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center md:text-left md:flex md:justify-between md:items-center">
        <p class="text-sm text-gray-400">© {{ currentYear }} MyApp. {{ $t('footer.allRightsReserved') }}</p>
        <div class="mt-4 md:mt-0">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';

export default {
  name: 'AppFooter',
  components: {
    LanguageSwitcher
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
/* Стили для footer */
footer {
  flex-shrink: 0; /* Не сжимается */
}
</style>
