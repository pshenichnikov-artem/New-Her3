<template>
  <div class="flex flex-row items-center justify-between gap-6 mt-8 w-full">
    <div class="flex items-center gap-3">
      <span class="text-base text-gray-700 font-semibold">{{ t('basePagination.show') }}</span>
      <select v-model="internalPageSize" class="border border-gray-300 rounded px-3 py-2 text-base">
        <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <!-- Новый макет пагинации с номерами страниц -->
    <div class="flex-1 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <!-- Кнопка "Назад" -->
        <button v-if="internalCurrentPage > 1" @click="changePage(internalCurrentPage - 1)"
          class="px-3 py-2 border rounded font-semibold text-base bg-white hover:bg-gray-100 transition">
          {{ t('basePagination.prev') }}
        </button>

        <!-- Номера страниц -->
        <div class="flex items-center">
          <!-- Первая страница всегда видна -->
          <button @click="changePage(1)" :class="getPageButtonClass(1)">
            1
          </button>

          <!-- Многоточие в начале, если текущая страница далеко от начала -->
          <span v-if="startPage > 2" class="px-3 py-2">...</span>

          <!-- Отображаем номера страниц вокруг текущей -->
          <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="getPageButtonClass(page)">
            {{ page }}
          </button>

          <!-- Многоточие в конце, если текущая страница далеко от конца -->
          <span v-if="endPage < totalPages - 1" class="px-3 py-2">...</span>

          <!-- Последняя страница всегда видна, если страниц больше одной -->
          <button v-if="totalPages > 1" @click="changePage(totalPages)" :class="getPageButtonClass(totalPages)">
            {{ totalPages }}
          </button>
        </div>

        <!-- Кнопка "Вперёд" -->
        <button v-if="internalCurrentPage < totalPages" @click="changePage(internalCurrentPage + 1)"
          class="px-3 py-2 border rounded font-semibold text-base bg-white hover:bg-gray-100 transition">
          {{ t('basePagination.next') }}
        </button>
      </div>
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
    ? 'px-3 py-2 border rounded font-bold text-base bg-indigo-600 text-white hover:bg-indigo-700 transition'
    : 'px-3 py-2 border rounded font-semibold text-base bg-white hover:bg-gray-100 transition';
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
