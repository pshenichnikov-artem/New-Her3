<template>
  <div class="relative group">
    <input type="text"
      class="w-full py-3 pl-12 pr-10 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base transition-all duration-300 hover:border-indigo-300 group-hover:shadow-sm"
      :placeholder="t('navbar.searchEvents')" v-model="searchQuery" @keyup.enter="handleSearch"
      @keydown.down.prevent="navigateDropdown(1)" @keydown.up.prevent="navigateDropdown(-1)"
      @keydown.esc="closeDropdown" @input="onSearchInput" @focus="isInputFocused = true" @blur="handleBlur"
      autocomplete="off" aria-label="Поиск мероприятий" />

    <!-- Иконка поиска (слева) -->
    <div class="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300"
      :class="{ 'text-gray-500': !isInputFocused, 'text-indigo-600': isInputFocused }">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Индикатор загрузки (появляется при поиске) -->
    <div v-if="eventApi.loading.search" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Кнопка поиска (справа) -->
    <button v-else
      class="absolute inset-y-0 right-0 flex items-center pr-3 transition-opacity duration-300 text-gray-500 hover:text-indigo-600 focus:outline-none"
      @click="handleSearch" type="button" aria-label="Выполнить поиск"
      :class="{ 'opacity-100': searchQuery.length > 0, 'opacity-0': searchQuery.length === 0 }">
      <span v-if="searchQuery.length > 0"
        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </button>

    <!-- Выпадающий список с результатами поиска -->
    <div v-if="showDropdown && eventApi.events.length > 0"
      class="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
      ref="dropdownRef">
      <ul class="py-1">
        <li v-for="(event, index) in eventApi.events" :key="event.id" @click="goToEvent(event.id)"
          @mouseenter="activeIndex = index"
          class="flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-indigo-50"
          :class="{ 'bg-indigo-50': activeIndex === index }">
          <!-- Изображение мероприятия (если есть) -->
          <div class="h-10 w-10 flex-shrink-0 mr-3 rounded border border-gray-200 overflow-hidden">
            <img v-if="event.images && event.images.length > 0" :src="event.images[0].url" :alt="event.title"
              class="h-full w-full object-cover">
            <div v-else class="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Информация о мероприятии -->
          <div class="flex-1 min-w-0">
            <!-- Название мероприятия с подсветкой совпадения -->
            <p class="text-sm font-medium text-gray-900 truncate" v-html="highlightMatch(event.title)"></p>
            <!-- Место проведения и дата -->
            <p class="text-xs text-gray-600 truncate">{{ event.location }}</p>
            <p class="text-xs text-indigo-600">{{ formatDate(event.startTime) }}</p>
          </div>
        </li>
      </ul>

      <!-- Показать все результаты -->
      <div
        class="border-t border-gray-100 px-4 py-2 bg-gray-50 text-center cursor-pointer hover:bg-indigo-50 transition-colors"
        @click="goToEventsList">
        <span class="text-sm font-medium text-indigo-600">{{ t('navbar.viewAllResults') }} ({{ eventApi.totalCount
          }})</span>
      </div>
    </div>

    <!-- Сообщение "Нет результатов" -->
    <div
      v-else-if="searchQuery.length >= 2 && !eventApi.loading.search && searchAttempted && eventApi.events.length === 0"
      class="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 p-4 text-center">
      <p class="text-sm text-gray-500">{{ t('navbar.noResults') }}</p>
    </div>

    <!-- Подсказка по горячим клавишам -->
    <div
      class="absolute right-3 top-full mt-2 bg-white text-xs text-gray-500 py-1 px-2 rounded shadow-md opacity-0 transition-opacity duration-300 pointer-events-none"
      :class="{ 'opacity-80': isInputFocused && !isMobile && !showDropdown }">
      <span class="flex items-center">
        {{ t('navbar.searchHint') }}
        <kbd
          class="ml-1 px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-800 font-semibold text-xs">Enter</kbd>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useEventApi } from '@/composables/api/useEventApi';
import { formatDateTime } from '@/utils/formatterUtils';
import { useAdaptiveInterface } from '@/composables/useAdaptiveInterface';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const eventApi = useEventApi();
const { isMobile } = useAdaptiveInterface();

// Состояния компонента
const searchQuery = ref('');
const isInputFocused = ref(false);
const showDropdown = ref(false);
const activeIndex = ref(-1);
const searchAttempted = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const isDropdownClicked = ref(false);

// Получаем поисковый запрос из маршрута при загрузке
watch(() => route.query.search, (newVal) => {
  searchQuery.value = newVal ? String(newVal) : '';
}, { immediate: true });

// Обработка ввода в поле поиска
const onSearchInput = () => {
  // Если поле пустое или содержит менее 2 символов, не выполняем поиск
  if (!searchQuery.value || searchQuery.value.length < 2) {
    showDropdown.value = false;
    return;
  }

  // Выполняем поиск с ограниченным количеством результатов для дропдауна
  performSearch();
};

// Функция для выполнения поиска
const performSearch = () => {
  searchAttempted.value = true;

  eventApi.searchEvents({
    filter: {
      eventIds: [],
      title: [searchQuery.value],
      location: null,
      dateFrom: null,
      dateTo: null,
      minPrice: null,
      maxPrice: null,
      isActive: true
    },
    sort: [{ sortBy: 'startTime', sortDirection: 'asc' }],
    pagination: { pageNumber: 1, pageSize: 5 } // Ограничиваем количество результатов для дропдауна
  }).then(() => {
    showDropdown.value = true;
    activeIndex.value = -1;
  });
};

// Обработка нажатия Enter или клика на кнопке поиска
const handleSearch = () => {
  if (searchQuery.value && searchQuery.value.trim().length > 0) {
    router.push({
      path: '/events',
      query: { search: searchQuery.value.trim() }
    });
  } else {
    router.push({ path: '/events' });
  }
  closeDropdown();
};

// Навигация по выпадающему списку
const navigateDropdown = (direction: number) => {
  if (!showDropdown.value || eventApi.events.length === 0) return;

  if (direction > 0) {
    // Навигация вниз
    activeIndex.value = activeIndex.value < eventApi.events.length - 1
      ? activeIndex.value + 1
      : 0;
  } else {
    // Навигация вверх
    activeIndex.value = activeIndex.value > 0
      ? activeIndex.value - 1
      : eventApi.events.length - 1;
  }

  // Обработка Enter для выбора текущего элемента
  const handleEnterKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && activeIndex.value >= 0 && eventApi.events[activeIndex.value]) {
      goToEvent(eventApi.events[activeIndex.value].id);
      event.preventDefault();
    }
    document.removeEventListener('keydown', handleEnterKeypress);
  };

  document.addEventListener('keydown', handleEnterKeypress, { once: true });
};

// Закрытие выпадающего списка
const closeDropdown = () => {
  showDropdown.value = false;
};

// Обработка потери фокуса
const handleBlur = () => {
  isInputFocused.value = false;
  // Используем setTimeout для предотвращения закрытия дропдауна до обработки клика по элементу
  setTimeout(() => {
    if (!isDropdownClicked.value) {
      closeDropdown();
    }
  }, 150);
};

// Переход к деталям мероприятия
const goToEvent = (eventId: string) => {
  router.push({ path: `/events/${eventId}` });
  closeDropdown();
};

// Переход к списку мероприятий с результатами поиска
const goToEventsList = () => {
  router.push({
    path: '/events',
    query: { search: searchQuery.value.trim() }
  });
  closeDropdown();
};

// Подсветка совпадений в тексте
const highlightMatch = (text: string): string => {
  if (!searchQuery.value || !text) return text;

  const regex = new RegExp(`(${searchQuery.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

// Форматирование даты с использованием нашего форматировщика
const formatDate = (dateString: string): string => {
  try {
    return formatDateTime(dateString, false); // Используем formatDateTime без секунд
  } catch (error) {
    return dateString;
  }
};

// Обработчик клика за пределами компонента
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node) &&
    !document.querySelector('.navbar-search')?.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Обработка горячих клавиш
const handleHotkeys = (event: KeyboardEvent) => {
  // Ctrl+K или Cmd+K для фокуса на поле поиска
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    const searchInput = document.querySelector('.navbar-search input');
    if (searchInput) {
      (searchInput as HTMLInputElement).focus();
    }
  }
};

// Монтирование компонента
onMounted(() => {
  document.addEventListener('keydown', handleHotkeys);
  document.addEventListener('mousedown', handleClickOutside);
});

// Размонтирование компонента
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleHotkeys);
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style lang="scss">
/* Стили для подсветки результатов поиска */
:deep(.highlight) {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

/* Анимация кнопки поиска при наведении */
button:hover svg {
  transform: translateX(2px);
  transition: transform 0.2s ease-in-out;
}

/* Улучшение доступности при использовании клавиатуры */
input:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

@include mobile {
  input {
    font-size: 16px;
    /* Предотвращает зум на iOS */
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
  }
}
</style>
