<template>
  <div class="flex flex-row items-center justify-between gap-4 w-full py-2">
    <!-- Размер страницы -->
    <div class="flex items-center gap-2">
      <span class="text-xs text-text-accent font-semibold">{{ t('basePagination.show') }}</span>
      <select v-model="internalPageSize"
        class="border border-primary-400 rounded px-2 py-1 text-xs bg-content text-text-accent focus:ring-primary-400 focus:border-primary-500 transition">
        <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <!-- Пагинация -->
    <div class="flex-1 flex items-center justify-center">
      <nav class="flex items-center gap-1 select-none" aria-label="Pagination">
        <!-- Кнопка "Назад" (disabled если на первой странице) -->
        <button @click="changePage(internalCurrentPage - 1)" :disabled="internalCurrentPage === 1"
          class="px-2 py-1 rounded border font-semibold text-xs transition min-w-[32px] min-h-[32px]" :class="internalCurrentPage === 1
            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-primary border-primary-200 hover:bg-primary-50 hover:text-primary-700'"
          aria-label="Previous">
          <svg class="w-4 h-4" fill="none" :stroke="internalCurrentPage === 1 ? '#b0b0b0' : '#222'" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Первая страница -->
        <button @click="changePage(1)" :class="getPageButtonClass(1)" class="min-w-[32px] min-h-[32px]">1</button>

        <!-- Многоточие в начале -->
        <span v-if="startPage > 2" class="px-1 text-gray-400 select-none">…</span>

        <!-- Номера страниц вокруг текущей -->
        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="getPageButtonClass(page)"
          class="min-w-[32px] min-h-[32px]">
          {{ page }}
        </button>

        <!-- Многоточие в конце -->
        <span v-if="endPage < totalPages - 1" class="px-1 text-gray-400 select-none">…</span>

        <!-- Последняя страница -->
        <button v-if="totalPages > 1" @click="changePage(totalPages)" :class="getPageButtonClass(totalPages)"
          class="min-w-[32px] min-h-[32px]">{{ totalPages }}</button>

        <!-- Кнопка "Вперёд" (disabled если на последней странице) -->
        <button @click="changePage(internalCurrentPage + 1)" :disabled="internalCurrentPage === totalPages"
          class="px-2 py-1 rounded border font-semibold text-xs transition min-w-[32px] min-h-[32px]" :class="internalCurrentPage === totalPages
            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-primary border-primary-200 hover:bg-primary-50 hover:text-primary-700'" aria-label="Next">
          <svg class="w-4 h-4" fill="none" :stroke="internalCurrentPage === totalPages ? '#b0b0b0' : '#222'"
            stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface PaginationProps {
  totalItems: number;
  pageSizes?: number[];
  maxVisiblePages?: number;
  currentPage?: number;
  pageSize?: number;
}

interface PaginationChangeEvent {
  page: number;
  pageSize: number;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSizes: () => [20, 50, 100, 150],
  maxVisiblePages: 5,
  currentPage: 1,
  pageSize: 20
});

const emit = defineEmits<{
  'pagination-change': [event: PaginationChangeEvent]
}>();

const { t } = useI18n();
const internalCurrentPage = ref(props.currentPage);
const internalPageSize = ref(props.pageSize || props.pageSizes[0]);

// Вычисляемые свойства
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / internalPageSize.value));
});

const startPage = computed(() => {
  if (internalCurrentPage.value <= Math.ceil(props.maxVisiblePages / 2)) {
    return 2;
  }
  if (internalCurrentPage.value > totalPages.value - Math.ceil(props.maxVisiblePages / 2)) {
    return Math.max(2, totalPages.value - props.maxVisiblePages);
  }
  return Math.max(2, internalCurrentPage.value - Math.floor(props.maxVisiblePages / 2));
});

const endPage = computed(() => {
  return Math.min(totalPages.value - 1, startPage.value + props.maxVisiblePages - 1);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Методы
const changePage = (page: number): void => {
  if (page >= 1 && page <= totalPages.value) {
    internalCurrentPage.value = page;
    emitChange();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

const changePageWithoutUpdate = (page: number): void => {
  if (page >= 1 && page <= totalPages.value) {
    internalCurrentPage.value = page;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

const getPageButtonClass = (page: number): string => {
  return page === internalCurrentPage.value
    ? 'px-2 py-1 border rounded font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition'
    : 'px-2 py-1 border rounded font-semibold text-sm bg-white hover:bg-gray-100 transition';
};

const emitChange = (): void => {
  emit('pagination-change', {
    page: internalCurrentPage.value,
    pageSize: internalPageSize.value
  });
};

// Наблюдатели
watch(internalPageSize, (newSize, oldSize) => {
  if (newSize !== oldSize) {
    internalCurrentPage.value = 1;
    emitChange();
  }
});

watch(() => props.currentPage, (newVal) => {
  if (newVal !== internalCurrentPage.value) {
    internalCurrentPage.value = newVal;
  }
});

watch(() => props.pageSize, (newVal) => {
  if (newVal !== internalPageSize.value) {
    internalPageSize.value = newVal;
  }
});
</script>

<style scoped>
/* Кнопки пагинации: плавный переход, одинаковый размер, скругление, жирный активный */
button,
span {
  min-height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border 0.15s;
  font-size: 0.95em;
  border-radius: 6px;
}

nav[aria-label="Pagination"] button {
  border: 1.5px solid transparent;
}

nav[aria-label="Pagination"] button[disabled] {
  cursor: not-allowed;
  opacity: 0.7;
}

nav[aria-label="Pagination"] button.bg-indigo-600 {
  background: #4c2a7a !important;
  color: #fff !important;
  border-color: #4c2a7a !important;
}

nav[aria-label="Pagination"] button.bg-white {
  background: #fff !important;
}

nav[aria-label="Pagination"] button:hover:not([disabled]):not(.bg-indigo-600) {
  background: #eee;
  color: #3a205f;
  border-color: #b69fcf;
}

nav[aria-label="Pagination"] button.bg-gray-200 {
  background: #f3f4f6 !important;
  color: #b0b0b0 !important;
  border-color: #f3f4f6 !important;
}

nav[aria-label="Pagination"] button:focus {
  outline: 2px solid #4c2a7a;
  outline-offset: 1px;
}

select {
  height: 28px;
  font-size: 0.95em;
  border-radius: 6px;
}
</style>
