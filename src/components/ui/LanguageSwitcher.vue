<template>
  <div class="flex items-center gap-4">
    <!-- Текст En -->
    <span
      class="text-lg font-medium cursor-pointer"
      :class="{
        'text-text-accent font-bold': currentLanguage === 'en',
        'text-text hover:text-text-accent': currentLanguage !== 'en',
      }"
      @click="setLanguage('en')"
    >
      En
    </span>

    <div
      class="relative w-16 h-8 bg-primary-800 border border-primary-600 rounded-full flex items-center px-1 cursor-pointer"
      @click="toggleLanguage"
    >
      <!-- Ползунок -->
      <div
        class="w-6 h-6 absolute bg-text-accent rounded-full shadow-md transition-all duration-300"
        :style="{ left: currentLanguage === 'en' ? '6px' : 'calc(100% - 6px - 24px)' }"
      ></div>
    </div>

    <!-- Текст Ru -->
    <span
      class="text-lg font-medium cursor-pointer"
      :class="{
        'text-text-accent font-bold': currentLanguage === 'ru',
        'text-text hover:text-text-accent': currentLanguage !== 'ru',
      }"
      @click="setLanguage('ru')"
    >
      Ru
    </span>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { locale } = useI18n();

const currentLanguage = computed(() => locale.value);

function toggleLanguage() {
  locale.value = currentLanguage.value === "en" ? "ru" : "en";
}

function setLanguage(lang) {
  locale.value = lang;
}
</script>

<style scoped>
/* Дополнительные стили для улучшения видимости переключателя в темных темах */
.bg-primary-800.border-primary-600 {
  border-width: 2px;
}
</style>
