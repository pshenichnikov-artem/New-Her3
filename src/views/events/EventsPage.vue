<template>
    <div class="min-h-screen flex flex-col">
        <MainNavbar />
        <!-- Контейнер с фоновым градиентом для лучшего контраста с карточками -->
        <div class="w-full flex-grow bg-gradient-to-b from-content to-content-dark">
            <!-- Заголовок страницы с отступами для контента -->
            <div class="px-4 md:px-8 py-6 md:py-8">
                <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 class="text-3xl font-bold text-text-accent mb-4 md:mb-0">{{ t('modules.events.title') }}</h1>
                    <button
                        class="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
                        @click="toggleFilters">
                        <IconsSet name="filter" class="h-5 w-5 mr-2" />
                        {{ showFilters ? t('modules.events.filters.hideFilters') :
                            t('modules.events.filters.showFilters') }}
                    </button>
                </div>

                <!-- Фильтры -->
                <div v-if="showFilters"
                    class="bg-primary-800 p-6 rounded-lg shadow-md mb-8 border border-primary-600 animate-fadeIn">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                        <!-- Поиск по названию (мультивыборный) -->
                        <TextFilter :title="t('modules.events.filters.title')"
                            :placeholder="t('modules.events.filters.titlePlaceholder')" v-model="filters.title"
                            :multipleSelect="true" :getSuggestions="getSuggestedTitles"
                            @update:modelValue="updateFilters">
                            <template #icon>
                                <IconsSet name="search" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </TextFilter>

                        <!-- Фильтр по тегу (мультивыборный) -->
                        <SelectFilter :title="t('modules.events.filters.tag')" :options="tagOptions"
                            v-model="filters.tag" :multipleSelect="true" @change="updateFilters">
                            <template #icon>
                                <IconsSet name="tag" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </SelectFilter>

                        <!-- Поиск по местоположению (мультивыборный) -->
                        <TextFilter :title="t('modules.events.filters.location')"
                            :placeholder="t('modules.events.filters.locationPlaceholder')" v-model="filters.location"
                            :multipleSelect="true" :getSuggestions="getSuggestedLocations"
                            @update:modelValue="updateFilters">
                            <template #icon>
                                <IconsSet name="location" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </TextFilter>

                        <!-- Диапазон дат -->
                        <DateRangeFilter :title="t('modules.events.filters.dateRange')"
                            :placeholder="t('modules.events.filters.dateRangePlaceholder')" v-model="dateRange"
                            @date-for-server="updateDateRange">
                            <template #icon>
                                <IconsSet name="calendar" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </DateRangeFilter>

                        <!-- Минимальная цена -->
                        <NumberFilter :title="t('modules.events.filters.minPrice')"
                            :placeholder="t('modules.events.filters.minPricePlaceholder')" v-model="filters.minPrice"
                            :currency="t('formatter.currency.RUB')" @update:modelValue="updateFilters">
                            <template #icon>
                                <IconsSet name="currencyRuble" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </NumberFilter>

                        <!-- Максимальная цена -->
                        <NumberFilter :title="t('modules.events.filters.maxPrice')"
                            :placeholder="t('modules.events.filters.maxPricePlaceholder')" v-model="filters.maxPrice"
                            :currency="t('formatter.currency.RUB')" @update:modelValue="updateFilters">
                            <template #icon>
                                <IconsSet name="currencyRuble" class="h-4 w-4 mr-1 text-text-accent" />
                            </template>
                        </NumberFilter>
                    </div>

                    <!-- Кнопки действий -->
                    <div class="flex justify-end mt-4 space-x-4">
                        <button @click="resetFilters"
                            class="px-4 py-2 bg-transparent border border-primary-600 text-text rounded-lg hover:bg-primary-700 transition-colors">
                            {{ t('modules.events.filters.reset') }}
                        </button>
                    </div>
                </div>

                <!-- Загрузка -->
                <div v-if="eventApi.loading.search" class="flex justify-center items-center py-12">
                    <div class="spinner"></div>
                </div>

                <!-- Сообщение об отсутствии событий -->
                <div v-else-if="!eventApi.events || eventApi.events.length === 0" class="text-center py-12">
                    <div class="text-text-muted text-lg">{{ t('modules.events.noEvents') }}</div>
                    <p class="mt-2 text-text-muted">{{ t('modules.events.tryDifferentFilters') }}</p>
                </div>

                <!-- Список событий - модифицировано для отображения 2 карточек в строку на десктопе и 1 на мобильном -->
                <div v-else>
                    <!-- Информация о количестве найденных событий -->
                    <div class="mb-6 text-text-muted">
                        {{ t('modules.events.found', { count: eventApi.totalCount ?? 0 }) }}
                    </div>

                    <!-- Сетка событий - с увеличенными отступами для лучшей видимости -->
                    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-10">
                        <EventCard v-for="event in eventApi.events" :key="event.id" :event="event"
                            class="event-card-animation" />
                    </div>

                    <!-- Пагинация с использованием BasePagination -->
                    <BasePagination v-if="eventApi.totalCount && eventApi.totalCount > 0"
                        :total-items="eventApi.totalCount" :current-page="currentPage" :page-size="pageSize"
                        @pagination-change="handlePaginationChange" />
                </div>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import TextFilter from '@/components/ui/filters/TextFilter.vue';
import NumberFilter from '@/components/ui/filters/NumberFilter.vue';
import SelectFilter from '@/components/ui/filters/SelectFilter.vue';
import DateRangeFilter from '@/components/ui/filters/DateRangeFilter.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import EventCard from '@/components/events/EventCard.vue';
import BasePagination from '@/components/ui/BasePagination.vue';
import type { EventFilterRequest } from '@/types/event/EventFilterRequest';
import type { EventSearchRequest } from '@/types/event/EventSearchRequest';
import { useEventApi } from '@/composables/api/useEventApi';
import { formatDateForServer } from '@/utils/formatterUtils';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const eventApi = useEventApi();

// Состояние компонента
const showFilters = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const dateRange = ref<[Date | null, Date | null] | null>(null);

// Начальное состояние фильтров (с пустыми массивами для мультивыборных фильтров)
const defaultFilters: EventFilterRequest = {
    eventIds: [],
    dateFrom: null,
    dateTo: null,
    minPrice: null,
    maxPrice: null,
    title: [],
    location: [],
    tag: [],
    isActive: null,
    description: null
};

// Рабочая копия фильтров
const filters = ref<EventFilterRequest>({ ...defaultFilters });

// Опции для выбора тегов
const tagOptions = [
    { value: 'concert', label: t('modules.events.tags.concert') },
    { value: 'festival', label: t('modules.events.tags.festival') },
    { value: 'exhibition', label: t('modules.events.tags.exhibition') },
    { value: 'theater', label: t('modules.events.tags.theater') },
    { value: 'sport', label: t('modules.events.tags.sport') },
    { value: 'workshop', label: t('modules.events.tags.workshop') },
    { value: 'other', label: t('modules.events.tags.other') },
];

// Функция для получения предложений заголовков
const getSuggestedTitles = async (input: string): Promise<string[]> => {
    if (!input || input.length < 2) return [];

    // Поиск событий с подходящими заголовками для подсказок
    const suggestRequest: EventSearchRequest = {
        filter: {
            eventIds: [],
            dateFrom: null,
            dateTo: null,
            minPrice: null,
            maxPrice: null,
            title: [input],
            location: [],
            tag: [],
            isActive: null,
            description: null
        },
        pagination: {
            page: 0,
            pageSize: 5 // Получаем только первые 5 результатов
        },
        sort: [
            { sortBy: 'title', sortDirection: 'asc' } // Сортировка по имени
        ]
    };

    const result = await eventApi.searchEvents(suggestRequest);

    // Если есть результаты, извлекаем заголовки и возвращаем их
    if (result && eventApi.events) {
        return eventApi.events.map(event => event.title);
    }
    return [];

};

// Функция для получения предложений местоположений
const getSuggestedLocations = async (input: string): Promise<string[]> => {
    if (!input || input.length < 2) return [];

    const suggestRequest: EventSearchRequest = {
        filter: {
            eventIds: [],
            dateFrom: null,
            dateTo: null,
            minPrice: null,
            maxPrice: null,
            title: [],
            location: [input],
            tag: [],
            isActive: null,
            description: null
        },
        pagination: {
            page: 0,
            pageSize: 5 // Получаем только первые 5 результатов
        },
        sort: [
            { sortBy: 'location', sortDirection: 'asc' } // Сортировка по местоположению
        ]
    };

    const result = await eventApi.searchEvents(suggestRequest);

    // Если есть результаты, извлекаем местоположения и возвращаем их
    if (result && eventApi.events) {
        return eventApi.events.map(event => event.location);
    }
    return [];
};

// Методы
const toggleFilters = () => {
    showFilters.value = !showFilters.value;
};

// Метод для загрузки фильтров из URL-параметров
const loadFiltersFromQuery = () => {
    const query = route.query;

    // Загрузка заголовка (как массив)
    if (query.title && Array.isArray(query.title)) {
        filters.value.title = query.title as string[];
    } else {
        filters.value.title = [];
    }

    // Загрузка местоположений (как массив)
    if (query.location && Array.isArray(query.location)) {
        filters.value.location = query.location as string[];
    } else {
        filters.value.location = [];
    }

    // Загрузка тегов (как массив)
    if (query.tag && Array.isArray(query.tag)) {
        filters.value.tag = query.tag as string[];
    } else {
        filters.value.tag = [];
    }

    // Загрузка диапазона цен
    if (query.minPrice) {
        filters.value.minPrice = Number(query.minPrice);
    }

    if (query.maxPrice) {
        filters.value.maxPrice = Number(query.maxPrice);
    }

    // Загрузка дат
    if (query.dateFrom || query.dateTo) {
        const fromDate = query.dateFrom ? new Date(query.dateFrom as string) : null;
        const toDate = query.dateTo ? new Date(query.dateTo as string) : null;

        filters.value.dateFrom = query.dateFrom as string || null;
        filters.value.dateTo = query.dateTo as string || null;

        dateRange.value = [fromDate, toDate];
    }

    // Загрузка пагинации
    if (query.page) {
        currentPage.value = parseInt(query.page as string, 10);
    }

    if (query.pageSize) {
        pageSize.value = parseInt(query.pageSize as string, 10);
    }
};

// Метод для обновления URL-параметров из текущих фильтров
const updateQueryString = () => {
    const query: Record<string, string | string[]> = {};

    // Добавляем только существующие фильтры
    if (filters.value.title && filters.value.title.length > 0) {
        query.title = filters.value.title;
    }

    if (filters.value.location && filters.value.location.length > 0) {
        query.location = filters.value.location;
    }

    if (filters.value.tag && filters.value.tag.length > 0) {
        query.tag = filters.value.tag;
    }

    // Исправленные проверки для minPrice и maxPrice - проверяем на null и undefined
    if (filters.value.minPrice !== undefined && filters.value.minPrice !== null) {
        query.minPrice = filters.value.minPrice.toString();
    }

    if (filters.value.maxPrice !== undefined && filters.value.maxPrice !== null) {
        query.maxPrice = filters.value.maxPrice.toString();
    }

    if (filters.value.dateFrom) {
        query.dateFrom = filters.value.dateFrom;
    }

    if (filters.value.dateTo) {
        query.dateTo = filters.value.dateTo;
    }

    // Добавляем пагинацию
    if (currentPage.value !== 1) {
        query.page = currentPage.value.toString();
    }

    if (pageSize.value !== 12) {
        query.pageSize = pageSize.value.toString();
    }

    // Обновляем URL без перезагрузки страницы
    router.replace({ query });
};

const updateDateRange = (dates: [string | null, string | null] | null) => {
    if (dates) {
        filters.value.dateFrom = dates[0];
        filters.value.dateTo = dates[1];
    } else {
        filters.value.dateFrom = null;
        filters.value.dateTo = null;
    }

    updateFilters();
};

// Обновленный метод для обновления фильтров - теперь сразу загружает данные
const updateFilters = () => {
    // Обновляем URL
    updateQueryString();
    // Сбрасываем страницу на первую при изменении фильтров
    currentPage.value = 1;
    // Сразу загружаем данные
    loadEvents();
};

const resetFilters = () => {
    filters.value = { ...defaultFilters };
    dateRange.value = null;
    currentPage.value = 1; // Сбрасываем страницу
    updateQueryString(); // Обновляем URL
    loadEvents(); // Загружаем данные
};

// Метод обработки изменения пагинации
const handlePaginationChange = (event: { page: number, pageSize: number }) => {
    currentPage.value = event.page;
    pageSize.value = event.pageSize;
    updateQueryString();
    loadEvents();
};

const loadEvents = async () => {
    const request: EventSearchRequest = {
        filter: {
            ...filters.value,
            // Правильно форматируем даты для сервера, если они существуют
            dateFrom: filters.value.dateFrom,
            dateTo: filters.value.dateTo
        },
        pagination: {
            page: currentPage.value,
            pageSize: pageSize.value
        },
        sort: [
            { sortBy: 'isActive', sortDirection: 'desc' },
            { sortBy: 'startTime', sortDirection: 'asc' }
             // Сортировка по заголовку
        ]
    };

    await eventApi.searchEvents(request);
};

// Для отслеживания изменений в URL
watch(() => route.query, (newQuery) => {
    // Обрабатываем только в случае, если изменения пришли извне
    // (например, по кнопке "Назад" в браузере)
    if (Object.keys(newQuery).length > 0) {
        loadFiltersFromQuery();
        loadEvents();
    }
}, { deep: true });

// Инициализация
onMounted(() => {
    // Загружаем фильтры из URL-параметров
    if (Object.keys(route.query).length > 0) {
        loadFiltersFromQuery();
    }
    loadEvents();
});
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}

/* Улучшенная анимация для карточек событий */
@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.event-card-animation {
    animation: slideUpFade 0.6s ease-out forwards;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(127, 90, 168, 0.2);
    border-radius: 50%;
    border-top-color: #7f5aa8;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Медиа-запросы для адаптивности EventCard */
@media (max-width: 768px) {
    .grid {
        gap: 2rem;
    }

    .event-card-animation {
        animation-delay: 0.1s;
    }
}

/* Эффект последовательного появления карточек */
.event-card-animation:nth-child(2n) {
    animation-delay: 0.1s;
}

.event-card-animation:nth-child(3n) {
    animation-delay: 0.2s;
}

.event-card-animation:nth-child(4n) {
    animation-delay: 0.3s;
}
</style>
