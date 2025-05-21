<template>
  <footer class="bg-indigo-900 text-white py-8 mt-auto border-t border-indigo-800">
    <div class="container mx-auto px-4">
      <!-- Логотип слева, показывается только на десктопе -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Колонка 1: Логотип -->
        <div class="hidden lg:block">
          <img src="https://static.tildacdn.com/tild3634-3764-4564-b734-633837646565/logo.svg" alt="Logo"
            class="w-64 h-auto logo-image-footer" />
        </div>

        <!-- Колонка 2: Контакты -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-indigo-200">{{ $t('footer.contacts.title') }}</h3>
          <div class="h-0.5 w-full bg-indigo-800 mb-4"></div>
          <div class="text-sm space-y-4 text-gray-300">
            <p>{{ $t('footer.contacts.address') }}<br>
              {{ $t('footer.contacts.city') }}</p>
            <p>
              {{ $t('footer.contacts.general') }}<br>
              <a href="mailto:info@events.ru"
                class="text-indigo-300 hover:text-indigo-100 hover:underline">info@events.ru</a>
            </p>
            <p>
              {{ $t('footer.contacts.support') }}<br>
              <a href="mailto:support@events.ru"
                class="text-indigo-300 hover:text-indigo-100 hover:underline">support@events.ru</a>
            </p>
            <p>
              {{ $t('footer.contacts.website') }}<br>
              <a href="https://www.events.ru"
                class="text-indigo-300 hover:text-indigo-100 hover:underline">www.events.ru</a>
            </p>

            <!-- Социальные сети -->
            <div class="flex space-x-4 pt-2">
              <a href="https://t.me/eventsgroup" target="_blank" rel="noopener"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors">
                <IconsSet name="telegram" class="w-5 h-5 text-white" />
              </a>
              <a href="https://vk.com/eventsgroup" target="_blank" rel="noopener"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors">
                <IconsSet name="vk" class="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <!-- Колонка 3: Часы работы -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-indigo-200">{{ $t('footer.hours.title') }}</h3>
          <div class="h-0.5 w-full bg-indigo-800 mb-4"></div>
          <div class="text-sm space-y-4 text-gray-300">
            <p>{{ $t('footer.hours.summer') }}</p>
            <p>{{ $t('footer.hours.summerTime') }}<br>
              {{ $t('footer.hours.summerEntry') }}</p>
            <p>{{ $t('footer.hours.winter') }}</p>
            <p>{{ $t('footer.hours.winterTime') }}<br>
              {{ $t('footer.hours.winterEntry') }}</p>
          </div>
        </div>

        <!-- Колонка 4: Правовая информация -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-indigo-200">{{ $t('footer.legal.title') }}</h3>
          <div class="h-0.5 w-full bg-indigo-800 mb-4"></div>
          <div class="text-sm space-y-2 text-gray-300">
            <p>{{ $t('footer.legal.fullName') }}</p>
            <p>{{ $t('footer.legal.shortName') }}</p>
            <p>{{ $t('footer.legal.address') }}</p>
            <p><span class="text-indigo-300">{{ $t('footer.legal.ogrnTitle') }}</span> {{ $t('footer.legal.ogrn') }}</p>
            <p><span class="text-indigo-300">{{ $t('footer.legal.kppTitle') }}</span> {{ $t('footer.legal.kpp') }}</p>
            <p><span class="text-indigo-300">{{ $t('footer.legal.innTitle') }}</span> {{ $t('footer.legal.inn') }}</p>
          </div>
        </div>
      </div>

      <!-- Мобильный логотип, только для мобильных устройств -->
      <div class="lg:hidden flex justify-center mt-8 mb-4">
        <img src="https://static.tildacdn.com/tild3634-3764-4564-b734-633837646565/logo.svg" alt="Logo"
          class="w-48 h-auto logo-image-footer" />
      </div>

      <!-- Copyright и переключатель языка -->
      <div class="border-t border-indigo-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-indigo-300">© {{ currentYear }} {{ $t('footer.copyright') }}</p>
        <div class="mt-4 md:mt-0">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import { computed } from 'vue';

const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>

<style scoped>
/* Стили для footer */
footer {
  flex-shrink: 0;
  /* Не сжимается */
}

/* Стиль для логотипа в футере */
.logo-image-footer {
  filter: brightness(1) contrast(1.2);
  /* Делаем изображение светлее для лучшей видимости на темном фоне */
  background-color: rgba(255, 255, 255, 0.1);
  /* Добавляем легкий светлый фон */
  padding: 10px 12px;
  /* Внутренние отступы для лучшей видимости */
  border-radius: 4px;
  /* Закругляем края */
  object-fit: contain;
  /* Гарантируем, что логотип сохраняет пропорции */
}
</style>
