<template>
  <footer class="bg-primary text-primary py-8 mt-auto border-t border-primary-800">
    <div class="w-full px-8">
      <!-- Логотип слева, показывается только на десктопе -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Колонка 1: Логотип -->
        <div class="hidden lg:block h-full flex items-center">
          <img src="https://static.tildacdn.com/tild3339-3937-4064-a233-333035646630/griffin.svg" alt="Logo"
            class="h-[280px] w-auto object-contain" />
        </div>

        <!-- Колонка 2: Контакты -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-text-accent">{{ t('footer.contacts.title') }}</h3>
          <div class="h-0.5 w-full bg-primary-800 mb-4"></div>
          <div class="text-sm space-y-4 text-text">
            <p>{{ t('footer.contacts.address') }}<br>
              {{ t('footer.contacts.city') }}</p>
            <p>
              {{ t('footer.contacts.general') }}<br>
              <a href="mailto:info@events.ru"
                class="text-text-accent hover:text-primary-200 hover:underline">info@events.ru</a>
            </p>
            <p>
              {{ t('footer.contacts.support') }}<br>
              <a href="mailto:support@events.ru"
                class="text-text-accent hover:text-primary-200 hover:underline">support@events.ru</a>
            </p>
            <p>
              {{ t('footer.contacts.website') }}<br>
              <a href="https://www.events.ru"
                class="text-text-accent hover:text-primary-200 hover:underline">www.events.ru</a>
            </p>

            <!-- Социальные сети -->
            <div class="flex space-x-4 pt-2">
              <a href="https://t.me/eventsgroup" target="_blank" rel="noopener"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 hover:bg-primary-600 transition-colors">
                <IconsSet name="telegram" class="w-5 h-5 text-text" />
              </a>
              <a href="https://vk.com/eventsgroup" target="_blank" rel="noopener"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 hover:bg-primary-600 transition-colors">
                <IconsSet name="vk" class="w-5 h-5 text-text" />
              </a>
            </div>
          </div>
        </div>

        <!-- Колонка 3: Часы работы -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-text-accent">{{ t('footer.hours.title') }}</h3>
          <div class="h-0.5 w-full bg-primary-800 mb-4"></div>
          <div class="text-sm space-y-4 text-text">
            <p>{{ t('footer.hours.summer') }}</p>
            <p>{{ t('footer.hours.summerTime') }}<br>
              {{ t('footer.hours.summerEntry') }}</p>
            <p>{{ t('footer.hours.winter') }}</p>
            <p>{{ t('footer.hours.winterTime') }}<br>
              {{ t('footer.hours.winterEntry') }}</p>
          </div>
        </div>

        <!-- Колонка 4: Правовая информация -->
        <div>
          <h3 class="text-lg font-semibold mb-2 text-text-accent">{{ t('footer.legal.title') }}</h3>
          <div class="h-0.5 w-full bg-primary-800 mb-4"></div>
          <div class="text-sm space-y-2 text-text">
            <p>{{ t('footer.legal.fullName') }}</p>
            <p>{{ t('footer.legal.shortName') }}</p>
            <p>{{ t('footer.legal.address') }}</p>
            <p><span class="text-text-accent">{{ t('footer.legal.ogrnTitle') }}</span> {{ t('footer.legal.ogrn') }}</p>
            <p><span class="text-text-accent">{{ t('footer.legal.kppTitle') }}</span> {{ t('footer.legal.kpp') }}</p>
            <p><span class="text-text-accent">{{ t('footer.legal.innTitle') }}</span> {{ t('footer.legal.inn') }}</p>
          </div>
        </div>
      </div>

      <!-- Мобильный логотип, только для мобильных устройств -->
      <div v-if="isMobile" class="flex justify-center mt-8 mb-4">
        <img src="https://static.tildacdn.com/tild3339-3937-4064-a233-333035646630/griffin.svg" alt="Logo"
          class="h-[200px] w-auto" />
      </div>

      <!-- Copyright и переключатель языка -->
      <div class="border-t border-primary-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-primary-300">© {{ currentYear }} {{ t('footer.copyright') }}</p>
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
import { useI18n } from 'vue-i18n';
import { useAdaptiveInterface } from '@/composables/useAdaptiveInterface';

const { t } = useI18n();
const { isMobile } = useAdaptiveInterface();

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
</style>
