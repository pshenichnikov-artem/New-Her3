<template>
    <!-- Основной контент для списка событий -->
    <div v-if="!route.params.id && route.name !== 'dashboard-events-create'">
        <AdminDataTable taTable :title="t('dashboard.events.tableTitle')" :columns="columns" :items="eventApi.events"
            :loading="eventApi.loading.search" :total-count="eventApi.totalCount" :current-page="pagination.page"
            :page-size="pagination.pageSize" @update:sort="updateSort" @pagination-change="handlePaginationChange"
            @apply-filters="loadEvents" @reset-filters="resetFilters" @add="openAddEventModal"
            @edit="openEditEventModal" @delete="showDeleteConfirmation">
            <!-- Секция фильтров - компактная версия -->
            <template #filters>
                <TextFilter :title="t('filters.event.title')" v-model="filter.title" :multiple-select="true"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="label" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <TextFilter :title="t('filters.event.location')" v-model="filter.location" :multiple-select="true"
                    class="compact-filter" :get-suggestions="loadLocation">
                    <template #icon>
                        <IconsSet name="location" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <TextFilter :title="t('filters.event.tag')" v-model="filter.tag" :multiple-select="true"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="tag" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <DateRangeFilter :title="t('filters.event.dateRange')" v-model="dateRange"
                    @date-for-server="updateServerDates" class="compact-filter">
                    <template #icon>
                        <IconsSet name="calendar" class="w-4 h-4 text-primary-400" />
                    </template>
                </DateRangeFilter>

                <NumberFilter :title="t('filters.event.minPrice')" v-model="filter.minPrice"
                    :currency="t('common.currency')" :multiple-select="false" class="compact-filter">
                    <template #icon>
                        <IconsSet name="priceTag" class="w-4 h-4 text-primary-400" />
                    </template>
                </NumberFilter>

                <NumberFilter :title="t('filters.event.maxPrice')" v-model="filter.maxPrice"
                    :currency="t('common.currency')" :multiple-select="false" class="compact-filter">
                    <template #icon>
                        <IconsSet name="priceTag" class="w-4 h-4 text-primary-400" />
                    </template>
                </NumberFilter>

                <SelectFilter :title="t('filters.event.active')" v-model="activeStatus" :options="activeOptions"
                    :multiple-select="false" @change="handleActiveStatusChange" class="compact-filter">
                    <template #icon>
                        <IconsSet name="toggle" class="w-4 h-4 text-primary-400" />
                    </template>
                </SelectFilter>
            </template>

            <!-- Кастомная колонка для eventId -->
            <template #cell-id="{ item }">
                <span class="text-white cursor-pointer select-none hover:underline transition duration-200"
                    title="Скопировать eventId" @click="handleCopy(item.id)">
                    {{ copiedId === item.id ? 'Скопировано!' : item.id }}
                </span>
            </template>
        </AdminDataTable>

        <!-- Модальное окно подтверждения удаления -->
        <ConfirmModal v-if="isDeleteConfirmationVisible" :title="t('dashboard.events.deleteConfirmTitle')"
            :message="t('dashboard.events.deleteConfirmMessage')" :confirm-text="t('common.buttons.delete')"
            :cancel-text="t('common.buttons.cancel')" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <!-- Рендеринг дочерних маршрутов (create/edit) -->
    <router-view v-else />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router'; // Добавлен импорт useRoute
import AdminDataTable from '@/components/adminLayout/AdminDataTable.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import TextFilter from '@/components/ui/filters/TextFilter.vue';
import NumberFilter from '@/components/ui/filters/NumberFilter.vue';
import SelectFilter from '@/components/ui/filters/SelectFilter.vue';
import DateRangeFilter from '@/components/ui/filters/DateRangeFilter.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import { useEventApi } from '@/composables/api/useEventApi';
import type { EventFilterRequest } from '@/types/event/EventFilterRequest';
import type { SortRequest } from '@/types/common/SortRequest';
import type { PaginationRequest } from '@/types/common/PaginationRequest';
import type { Column } from '@/components/adminLayout/AdminDataTable.vue';
import { useCopyWithFeedback } from '@/utils/copyUtils';
import type { EventResponse } from '@/types/event/EventResponse';

const { t } = useI18n();
const eventApi = useEventApi();
const router = useRouter();
const route = useRoute(); // Инициализация route с использованием useRoute

// Состояние компонента
const filter = reactive<EventFilterRequest>({
    eventIds: [],
    title: [],
    location: [],
    tag: [],
    description: null,
    dateFrom: null,
    dateTo: null,
    minPrice: null,
    maxPrice: null,
    isActive: null
});

// Добавляем отдельное состояние для активного статуса, который будет синхронизироваться с filter.isActive
const activeStatus = ref<string | null>(null);

// Дополнительное состояние для поддержки множественного выбора в фильтрах
const dateRange = ref<[Date | null, Date | null] | null>(null);
const pagination = reactive<PaginationRequest>({
    page: 1,
    pageSize: 20
});
const sort = ref<SortRequest[]>([

]);

// Опции для фильтра активности (преобразуем boolean в string)
const activeOptions = [
    { value: null, label: t('filters.all') },
    { value: 'true', label: t('common.yes') },
    { value: 'false', label: t('common.no') }
];

// Обработчик изменения статуса активности
const handleActiveStatusChange = (value: string | number | (string | number | null)[] | null | undefined) => {
    // Теперь обрабатываем более широкий тип, который может вернуть SelectFilter
    if (value === 'true') {
        filter.isActive = true;
    } else if (value === 'false') {
        filter.isActive = false;
    } else {
        filter.isActive = null;
    }
};

// Синхронизируем начальное значение с filter.isActive
watch(() => filter.isActive, (newVal) => {
    if (newVal === true) {
        activeStatus.value = 'true';
    } else if (newVal === false) {
        activeStatus.value = 'false';
    } else {
        activeStatus.value = null;
    }
}, { immediate: true });

// Определение колонок таблицы
const columns: Column[] = [
    {
        key: 'id',
        label: t('event.id'),
        type: 'text',
        sortable: true,
    },
    {
        key: 'title',
        label: t('event.title'),
        type: 'text',
        sortable: true,
    },
    {
        key: 'startTime',
        label: t('event.startTime'),
        type: 'datetime',
        sortable: true
    },
    {
        key: 'location',
        label: t('event.location'),
        type: 'text',
        sortable: true
    },
    {
        key: 'price',
        label: t('event.price'),
        type: 'currency',
        sortable: true,
        align: 'right',
        width: 'w-32'
    },
    {
        key: 'isActive',
        label: t('event.active'),
        type: 'boolean',
        sortable: true,
        align: 'center',
        width: 'w-32'
    },
];

// Методы
const loadEvents = async () => {
    await eventApi.searchEvents({
        filter,
        sort: sort.value,
        pagination
    });
};

const loadLocation = async (location: string) => {
    const events = await eventApi.searchEvents({
        filter: {
            eventIds: [],
            description: null,
            dateFrom: null,
            dateTo: null,
            minPrice: null,
            maxPrice: null,
            title: [],
            location: [location],
            isActive: null,
            tag: []
        },
        sort: [
            { sortBy: "location", sortDirection: "asc" }
        ],
        pagination: { page: 1, pageSize: 20 }
    });

    const locations = events ? events.items.map(i => i.location) : []
    console.error(locations)

    return locations
};

const updateSort = (newSort: SortRequest[]) => {
    console.info('Updating sort:', newSort);
    sort.value = newSort;
    loadEvents();
};

const handlePaginationChange = (paginationData: { page: number; pageSize: number }) => {
    pagination.page = paginationData.page;
    pagination.pageSize = paginationData.pageSize;
    loadEvents();
};

const updateServerDates = (dates: [string | null, string | null] | null) => {
    if (dates) {
        filter.dateFrom = dates[0];
        filter.dateTo = dates[1];
    } else {
        filter.dateFrom = null;
        filter.dateTo = null;
    }
};

const resetFilters = () => {
    // Сбрасываем фильтры к начальным значениям
    Object.assign(filter, {
        eventIds: [],
        title: [],
        location: [],
        tag: [],
        description: null,
        dateFrom: null,
        dateTo: null,
        minPrice: null,
        maxPrice: null,
        isActive: null
    });

    // Сбрасываем сортировку
    sort.value = [];

    // Не забываем обновить activeStatus
    activeStatus.value = null;

    dateRange.value = null;
    pagination.page = 1;
    loadEvents();
};

const openAddEventModal = () => {
    router.push('/dashboard/events/create');
};

const openEditEventModal = (event: any) => {
    if (event && event.id) {
        router.push(`/dashboard/events/edit/${event.id}`);
    }
};

const isDeleteConfirmationVisible = ref(false);
const eventToDelete = ref<any>(null);

const showDeleteConfirmation = (event: any) => {
    eventToDelete.value = event;
    isDeleteConfirmationVisible.value = true;
};

const confirmDelete = async () => {
    if (eventToDelete.value && eventToDelete.value.id) {
        await eventApi.deleteEvent(eventToDelete.value.id);
        isDeleteConfirmationVisible.value = false;
        eventToDelete.value = null;
        loadEvents();
    }
};

const cancelDelete = () => {
    isDeleteConfirmationVisible.value = false;
    eventToDelete.value = null;
};

const { copiedId, handleCopy } = useCopyWithFeedback();

// Загрузка данных при монтировании компонента
onMounted(() => {
    loadEvents();
});
</script>

<style scoped>
/* Компактные стили для фильтров */
:deep(.compact-filter) {
    margin-bottom: 0.25rem;
}

:deep(.compact-filter label) {
    font-size: 0.75rem;
    margin-bottom: 0.125rem;
}

:deep(.compact-filter input),
:deep(.compact-filter select) {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 0.875rem;
}
</style>
