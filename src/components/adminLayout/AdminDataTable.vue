<template>
    <div
        class="bg-content rounded-xl shadow-md border border-primary-700 flex flex-col min-h-0 max-h-[calc(100vh-48px)] h-[calc(100vh-48px)]">
        <!-- Секция фильтров с кнопками управления -->
        <div class="p-3 border-b border-primary-600 bg-primary-700">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
                <slot name="filters"></slot>
            </div>

            <!-- Кнопки управления фильтрами - изменен порядок -->
            <div class="flex items-center justify-between gap-2 mt-2">
                <!-- Кнопки фильтров слева -->
                <div class="flex items-center gap-2">
                    <button @click="applyFilters"
                        class="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        {{ t('adminDataTable.applyFilters') }}
                    </button>
                    <button @click="resetFilters"
                        class="px-3 py-1.5 border border-primary-400 rounded-lg text-text-accent bg-primary-600 hover:bg-primary-500 transition-colors duration-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ t('adminDataTable.resetFilters') }}
                    </button>
                </div>

                <!-- Кнопка добавления справа -->
                <button v-if="showAddButton" @click="$emit('add')"
                    class="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ addButtonText || t('adminDataTable.add') }}
                </button>
            </div>
        </div>

        <!-- Основная секция с таблицей данных - автоматическая высота -->
        <div class="overflow-x-auto bg-content flex-grow min-h-0 max-h-full">
            <div class="overflow-y-auto h-full min-h-0 max-h-full">
                <table class="min-w-full w-max border-separate border-spacing-0 table-fixed">
                    <colgroup>
                        <col v-for="column in columns" :key="column.key" :style="column.width
                            ? `width:${column.width.replace(/^w-/, '')};max-width:${column.width.replace(/^w-/, '')};min-width:80px;`
                            : 'max-width:320px;min-width:80px;width:auto;'" />
                        <col style="width:112px;max-width:128px;min-width:112px;" />
                    </colgroup>
                    <thead class="sticky top-0 z-20">
                        <tr>
                            <th v-for="column in columns" :key="column.key" scope="col" :class="[
                                getColumnHeaderClass(column),
                                'text-white',
                                'border-l-4 border-primary-600',
                                'border-t-4 border-b-4 border-[#4c2a7a]',
                                'border-r-2 border-[#3a205f]',
                                'bg-[#24232a]',
                                'z-20',
                                'truncate',
                                column.width ? '' : 'max-w-xs'
                            ]" @click="handleSort(column)">
                                <div class="flex items-center">
                                    <span class="truncate block w-full" :title="column.label">{{ column.label }}</span>
                                    <div v-if="column.sortable !== false" class="ml-1 flex-shrink-0">
                                        <svg v-if="getSortDirection(column.key) === 'asc'"
                                            class="w-4 h-4 text-primary-300" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 15l7-7 7 7" />
                                        </svg>
                                        <svg v-else-if="getSortDirection(column.key) === 'desc'"
                                            class="w-4 h-4 text-primary-300" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <svg v-else class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    </div>
                                </div>
                            </th>
                            <th scope="col"
                                class="relative px-6 py-2 w-[112px] max-w-[128px] min-w-[112px] border-l-2 text-white border-b-4 border-t-4 border-[#4c2a7a] bg-[#24232a] truncate sticky right-0 z-10 shadow-[0_0_8px_0_rgba(36,35,42,0.7)]">
                                <span class="sr-only">{{ t('adminDataTable.actions') }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="loading">
                            <tr v-for="i in 5" :key="`loading-${i}`"
                                class="bg-primary-700 bg-opacity-20 border-b border-primary-600">
                                <td v-for="column in columns" :key="`loading-${i}-${column.key}`"
                                    class="px-6 py-4 whitespace-nowrap text-white border-r border-primary-600">
                                    <div class="h-4 bg-primary-600 bg-opacity-30 rounded animate-pulse"></div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-white border-r border-primary-600 sticky right-0 z-0 bg-[#24232a]">
                                    <div class="h-4 bg-primary-600 bg-opacity-30 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="items.length">
                            <tr v-for="(item, index) in items" :key="getItemKey(item, index)"
                                class="hover:bg-primary-700 hover:bg-opacity-10 transition-colors duration-150 border-b border-primary-600">
                                <td v-for="(column, colIndex) in columns"
                                    :key="`${getItemKey(item, index)}-${column.key}`" :class="[
                                        getColumnClass(column),
                                        'text-white border-r border-primary-600',
                                        'truncate',
                                        column.width ? '' : 'max-w-xs'
                                    ]" :title="getItemValue(item, column.key)">
                                    <!-- Слот для кастомного отображения ячейки -->
                                    <slot :name="`cell-${column.key}`" :item="item"
                                        :value="getItemValue(item, column.key)">
                                        <div v-if="column.type === 'image' && getItemValue(item, column.key)">
                                            <img :src="getItemValue(item, column.key)"
                                                class="h-10 w-10 rounded-md object-cover"
                                                :alt="`${column.label} image`" />
                                        </div>
                                        <div v-else-if="column.type === 'boolean'" class="text-center">
                                            <span v-if="getItemValue(item, column.key)"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {{ t('common.yes') }}
                                            </span>
                                            <span v-else
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                {{ t('common.no') }}
                                            </span>
                                        </div>
                                        <div v-else-if="column.type === 'date'">
                                            {{ formatDate(getItemValue(item, column.key)) }}
                                        </div>
                                        <div v-else-if="column.type === 'datetime'">
                                            {{ formatDateTime(getItemValue(item, column.key)) }}
                                        </div>
                                        <div v-else-if="column.type === 'number'" class="text-right">
                                            {{ formatNumber(getItemValue(item, column.key)) }}
                                        </div>
                                        <div v-else-if="column.type === 'currency'" class="text-right">
                                            {{ formatCurrency(getItemValue(item, column.key)) }}
                                        </div>
                                        <div v-else-if="column.type === 'status'" class="text-center">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="getStatusClass(getItemValue(item, column.key), column.statusContext || 'common')">
                                                {{ t(getStatusTranslationPath(getItemValue(item, column.key),
                                                    column.statusContext || 'common')) }}
                                            </span>
                                        </div>
                                        <div v-else>{{ getItemValue(item, column.key) }}</div>
                                    </slot>
                                </td>
                                <td
                                    class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium border-l border-primary-500 text-white border-r border-primary-600 truncate w-[112px] max-w-[128px] min-w-[112px] sticky right-0 z-0 bg-[#24232a] shadow-[0_0_8px_0_rgba(36,35,42,0.7)]">
                                    <div class="flex items-center justify-end space-x-2">
                                        <button v-if="showEditButton" @click="$emit('edit', item)"
                                            class="p-1.5 rounded-md text-primary-300 hover:bg-primary-600 hover:text-white transition-colors"
                                            :title="t('adminDataTable.edit')">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button v-if="showDeleteButton" @click="confirmDelete(item)"
                                            class="p-1.5 rounded-md text-notification-error hover:bg-notification-error hover:text-white transition-colors"
                                            :title="t('adminDataTable.delete')">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        <slot name="row-actions" :item="item"></slot>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-white">
                                <div class="flex flex-col items-center text-primary-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-400 mb-3"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p class="text-lg font-medium text-text-accent">{{ noDataText ||
                                        t('adminDataTable.noData') }}</p>
                                    <p class="text-sm mt-1 text-primary-300">{{ noDataDescription ||
                                        t('adminDataTable.noDataDescription') }}</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Пагинация - скрываем, если общее количество элементов меньше или равно размеру страницы -->
        <div v-if="totalCount > pageSize" class="px-4 py-2 bg-primary-700 border-t border-primary-600">
            <BasePagination :total-items="totalCount" :current-page="currentPage" :page-size="pageSize"
                @pagination-change="handlePaginationChange" />
        </div>

        <!-- Модальное окно подтверждения удаления -->
        <div v-if="showDeleteConfirmation" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    @click="showDeleteConfirmation = false">
                </div>
                <div
                    class="inline-block align-bottom bg-form rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-primary-600">
                    <div class="bg-form px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-notification-error-bg sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-notification-error" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-text-accent" id="modal-title">
                                    {{ t('adminDataTable.confirmDelete') }}
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-primary-300">
                                        {{ t('adminDataTable.confirmDeleteDescription') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-primary-800 bg-opacity-30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="handleDelete" type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-notification-error text-base font-medium text-white hover:bg-notification-error-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-notification-error sm:ml-3 sm:w-auto sm:text-sm">
                            {{ t('adminDataTable.delete') }}
                        </button>
                        <button @click="showDeleteConfirmation = false" type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-primary-500 shadow-sm px-4 py-2 bg-primary-700 text-base font-medium text-primary-300 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            {{ t('common.cancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BasePagination from '@/components/ui/BasePagination.vue';
import {
    formatDate,
    formatDateTime,
    formatNumber,
    formatCurrency
} from '@/utils/formatterUtils';
import { getStatusInfo } from '@/utils/statusUtils';
import type { SortRequest } from '@/types/common/SortRequest';
import type { PaginationRequest } from '@/types/common/PaginationRequest';

export interface Column {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'image' | 'currency' | 'status';
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'right' | 'center';
    statusContext?: string;
    cssClass?: string;
}

// Props
interface AdminDataTableProps {
    title: string;
    columns: Column[];
    items: any[];
    loading?: boolean;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    keyField?: string;
    noDataText?: string;
    noDataDescription?: string;
    showAddButton?: boolean;
    showEditButton?: boolean;
    showDeleteButton?: boolean;
    addButtonText?: string;
    sortable?: boolean;
}

const props = withDefaults(defineProps<AdminDataTableProps>(), {
    loading: false,
    keyField: 'id',
    showAddButton: true,
    showEditButton: true,
    showDeleteButton: true,
    sortable: true,
});

// Emits
const emit = defineEmits<{
    'update:currentPage': [page: number];
    'update:pageSize': [size: number];
    'update:sort': [sort: SortRequest[]];
    'apply-filters': [];
    'reset-filters': [];
    'add': [];
    'edit': [item: any];
    'delete': [item: any];
    'pagination-change': [pagination: { page: number; pageSize: number }];
}>();

// Hooks and state
const { t } = useI18n();
const showDeleteConfirmation = ref(false);
const itemToDelete = ref<any>(null);
const sortBy = ref<SortRequest[]>([]);

// Добавляем вычисляемое свойство для определения необходимости отображения пагинации
const showPagination = computed(() => {
    return props.totalCount > props.pageSize;
});

// Methods
const getItemKey = (item: any, index: number) => {
    return props.keyField && item[props.keyField] ? item[props.keyField] : `row-${index}`;
};

const getItemValue = (item: any, key: string) => {
    if (!key || !item) return '';

    // Handle nested properties (e.g., 'user.name')
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : ''), item);
};

const getColumnClass = (column: Column) => {
    const base = 'px-4 py-2 whitespace-nowrap'; // Уменьшены отступы
    const align = column.align
        ? column.align === 'right'
            ? 'text-right'
            : column.align === 'center'
                ? 'text-center'
                : 'text-left'
        : 'text-left';

    return [
        base,
        align,
        column.width || '',
        column.cssClass || '',
        column.type === 'number' || column.type === 'currency' ? 'text-right' : ''
    ].filter(Boolean).join(' ');
};

const getColumnHeaderClass = (column: Column) => {
    const base = 'px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-primary-500';
    const sortableClass = column.sortable !== false && props.sortable ? 'cursor-pointer hover:bg-primary-500' : '';
    const align = column.align
        ? column.align === 'right'
            ? 'text-right'
            : column.align === 'center'
                ? 'text-center'
                : 'text-left'
        : 'text-left';

    return [base, sortableClass, align, column.width || ''].filter(Boolean).join(' ');
};

const getSortDirection = (key: string): 'asc' | 'desc' | null => {
    const sortItem = sortBy.value.find(item => item.sortBy === key);
    return sortItem ? sortItem.sortDirection : null;
};

const handleSort = (column: Column) => {
    if (column.sortable === false || !props.sortable) return;

    const key = column.key;
    const currentSort = getSortDirection(key);

    // Remove this column from existing sorts if present
    const newSortBy = sortBy.value ? sortBy.value.filter(item => item.sortBy !== key) : [];

    // Add new sort direction or remove if it was descending
    if (!currentSort) {
        newSortBy.push({ sortBy: key, sortDirection: 'asc' });
    } else if (currentSort === 'asc') {
        newSortBy.push({ sortBy: key, sortDirection: 'desc' });
    }
    // If it was desc, we've already removed it

    sortBy.value = newSortBy;
    emit('update:sort', newSortBy);
};

const getStatusClass = (status: string, context: string = 'common') => {
    if (!status) return 'bg-gray-100 text-gray-800';
    return getStatusInfo(status, context).cssClass;
};

const getStatusTranslationPath = (status: string, context: string = 'common') => {
    if (!status) return '';
    return getStatusInfo(status, context).translationPath;
};

const handlePaginationChange = (pagination: { page: number; pageSize: number }) => {
    emit('update:currentPage', pagination.page);
    emit('update:pageSize', pagination.pageSize);
    emit('pagination-change', pagination);
};

const confirmDelete = (item: any) => {
    itemToDelete.value = item;
    showDeleteConfirmation.value = true;
};

const handleDelete = () => {
    if (itemToDelete.value) {
        emit('delete', itemToDelete.value);
        showDeleteConfirmation.value = false;
        itemToDelete.value = null;
    }
};

const applyFilters = () => {
    // Сброс страницы на первую при применении фильтров
    emit('update:currentPage', 1);
    emit('pagination-change', { page: 1, pageSize: props.pageSize });
    emit('apply-filters');
};

const resetFilters = () => {
    sortBy.value = [];
    // Сброс страницы и размера страницы на дефолтные значения
    emit('update:currentPage', 1);
    emit('update:pageSize', 20);
    emit('pagination-change', { page: 1, pageSize: 20 });
    emit('update:sort', []);
    emit('reset-filters');
};

// Watch for sort changes from parent
watch(() => props.currentPage, (newPage) => {
    // Optional sync with parent if needed
});
</script>

<style scoped>
/* Ensure fixed headers with scrollable content */
thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: var(--color-primary-600);
}

/* Ограничиваем высоту таблицы размером экрана, чтобы страница не прокручивалась */
.bg-content.rounded-xl {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    max-height: calc(100vh - 48px);
    /* 48px — примерная высота navbar/отступа сверху */
    height: calc(100vh - 48px);
}

.overflow-x-auto.bg-content.flex-grow {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    max-height: 100%;
}

.overflow-y-auto.h-full {
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow-y: auto;
}

/* Фиксация последней колонки справа и стилизация тени */
th.sticky.right-0 {
    background: #24232a !important;
    box-shadow: -2px 0 8px 0 rgba(36, 35, 42, 0.7);
    z-index: 10;
}

td.sticky.right-0 {
    background: #24232a !important;
    box-shadow: -2px 0 8px 0 rgba(36, 35, 42, 0.7);
    z-index: 0;
}
</style>
