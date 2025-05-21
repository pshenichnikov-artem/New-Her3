<template>
    <div class="flex flex-col min-h-screen">
        <div class="grid bg-content grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Колонка 1: Простые фильтры -->
            <div class="bg-content p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-bold mb-4 text-gray-800">Обычные фильтры</h2>

                <!-- SelectFilter (обычный) -->
                <SelectFilter title="Сортировка" :options="sortOptions" v-model="selectedSort"
                    @change="logChange('Сортировка', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                    </template>
                </SelectFilter>

                <!-- TextFilter (обычный) -->
                <TextFilter class="mt-6" title="Поиск по названию" placeholder="Введите название товара..."
                    v-model="searchText" @update:modelValue="logChange('Поиск по названию', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </template>
                </TextFilter>

                <!-- TextFilter с множественным выбором -->
                <TextFilter class="mt-6" title="Теги (множественный выбор)" placeholder="Добавить тег..."
                    v-model="multipleSearchTags" :multipleSelect="true" :getSuggestions="getSuggestedTags"
                    @update:modelValue="logChange('Множественный выбор тегов', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </template>
                </TextFilter>

                <!-- NumberFilter (обычный) -->
                <NumberFilter class="mt-6" title="Цена" placeholder="Введите цену..." v-model="priceValue" currency="₽"
                    @update:modelValue="logChange('Цена', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </NumberFilter>

                <NumberFilter class="mt-6" title="Цена" placeholder="Введите цену..." v-model="priceValue" currency="₽"
                    @update:modelValue="logChange('Цена', $event)" :multiple-select="true"
                    :get-suggestions="() => [100, 200, 300]">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </NumberFilter>

                <hr class="my-6 border-gray-200" />

                <h3 class="text-lg font-bold mb-4 text-gray-800">Фильтры по дате (одиночный выбор)</h3>

                <!-- DateFilter (одиночный выбор) -->
                <DateFilter class="mt-6" title="Дата" placeholder="Выберите дату" v-model="singleDateValue"
                    @update:modelValue="logChange('Одиночная дата', $event)"
                    @date-for-server="logChange('Серверный формат одиночной даты', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateFilter>

                <!-- DateFilter (одиночный выбор) со временем -->
                <DateFilter class="mt-6" title="Дата со временем" placeholder="Выберите дату и время"
                    v-model="singleDateTimeValue" :showTime="true"
                    @update:modelValue="logChange('Одиночная дата со временем', $event)"
                    @date-for-server="logChange('Серверный формат даты со временем', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </DateFilter>

                <!-- DateFilter (одиночный выбор) с макс. датой -->
                <DateFilter class="mt-6" title="Дата (макс. сегодня)" placeholder="Выберите дату (до сегодня)"
                    v-model="singleDateMaxValue" :maxCurrentTime="true"
                    @update:modelValue="logChange('Дата с макс. ограничением', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateFilter>

                <!-- DateFilter (одиночный выбор) с мин. датой -->
                <DateFilter class="mt-6" title="Дата (мин. сегодня)" placeholder="Выберите дату (от сегодня)"
                    v-model="singleDateMinValue" :minDate="today"
                    @update:modelValue="logChange('Дата с мин. ограничением', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateFilter>

                <!-- DateFilter (множественный выбор) -->
                <DateFilter class="mt-6" title="Множественный выбор дат" placeholder="Выберите несколько дат"
                    v-model="multipleDatesValue" :multipleSelect="true"
                    @update:modelValue="logChange('Множественный выбор дат', $event)"
                    @date-for-server="logChange('Серверный формат множественных дат', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateFilter>

                <!-- DateFilter (множественный выбор с ограничением) -->
                <DateFilter class="mt-6" title="Множественный выбор дат (мин. сегодня)"
                    placeholder="Выберите даты (от сегодня)" v-model="multipleDatesMinValue" :multipleSelect="true"
                    :minDate="today"
                    @update:modelValue="logChange('Множественный выбор дат с мин. ограничением', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateFilter>
            </div>

            <!-- Колонка 2: Фильтры диапазона дат -->
            <div class="bg-content p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-bold mb-4 text-gray-800">Фильтры диапазона дат</h2>

                <!-- DateRangeFilter (без времени) -->
                <DateRangeFilter class="mt-6" title="Диапазон дат" placeholder="Выберите диапазон дат"
                    v-model="dateRangeValue" @update:modelValue="logChange('Диапазон дат', $event)"
                    @date-for-server="logChange('Серверный формат диапазона дат', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateRangeFilter>

                <!-- DateRangeFilter (с временем) -->
                <DateRangeFilter class="mt-6" title="Диапазон дат с временем"
                    placeholder="Выберите диапазон дат со временем" v-model="dateRangeTimeValue" :showTime="true"
                    @update:modelValue="logChange('Диапазон дат со временем', $event)"
                    @date-for-server="logChange('Серверный формат диапазона дат со временем', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </DateRangeFilter>

                <!-- DateRangeFilter (макс. дата сегодня) -->
                <DateRangeFilter class="mt-6" title="Диапазон дат (макс. сегодня)"
                    placeholder="Выберите диапазон (до сегодня)" v-model="dateRangeMaxValue" :maxCurrentTime="true"
                    @update:modelValue="logChange('Диапазон дат с макс. ограничением', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateRangeFilter>

                <!-- DateRangeFilter (мин. дата сегодня) -->
                <DateRangeFilter class="mt-6" title="Диапазон дат (мин. сегодня)"
                    placeholder="Выберите диапазон (от сегодня)" v-model="dateRangeMinValue" :minDate="today"
                    @update:modelValue="logChange('Диапазон дат с мин. ограничением', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </template>
                </DateRangeFilter>

                <!-- DateRangeFilter (со временем и мин. час вперед) -->
                <DateRangeFilter class="mt-6" title="Диапазон дат (мин. час вперед)"
                    placeholder="Выберите диапазон (от часа вперед)" v-model="dateRangeMinHourValue" :showTime="true"
                    :minCurrentTimePlusHour="true"
                    @update:modelValue="logChange('Диапазон дат с мин. часом вперед', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </DateRangeFilter>

                <!-- Другие контролы для демонстрации -->
                <hr class="my-6 border-gray-200" />
                <h3 class="text-lg font-bold mb-4 text-gray-800">Другие контролы</h3>

                <SelectFilter class="mt-6" title="Статус" :options="statusOptions" v-model="selectedStatus"
                    @change="logChange('Статус', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </template>
                </SelectFilter>

                <SelectFilter class="mt-6" title="Теги товаров" :options="tagOptions" v-model="selectedTags"
                    :multipleSelect="true" @change="logChange('Теги товаров', $event)">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </template>
                </SelectFilter>
            </div>
        </div>

        <!-- Панель результатов -->
        <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Результаты</h2>
            <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-80">{{ formattedResults }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SelectFilter from '@/components/ui/filters/SelectFilter.vue';
import TextFilter from '@/components/ui/filters/TextFilter.vue';
import NumberFilter from '@/components/ui/filters/NumberFilter.vue';
import DateFilter from '@/components/ui/filters/DateFilter.vue';
import DateRangeFilter from '@/components/ui/filters/DateRangeFilter.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Текущая дата для ограничений
const today = new Date();

// Состояние обычных фильтров
const selectedSort = ref('name_asc');
const searchText = ref('');
const multipleSearchTags = ref<string[]>([]);
const priceValue = ref(null);
const selectedStatus = ref(null);
const selectedTags = ref<string[]>([]);

// Состояние одиночных фильтров дат
const singleDateValue = ref(null);
const singleDateTimeValue = ref(null);
const singleDateMaxValue = ref(null);
const singleDateMinValue = ref(null);

// Состояние множественного выбора дат
const multipleDatesValue = ref<string[]>([]);
const multipleDatesMinValue = ref<string[]>([]);

// Состояние диапазонов дат
const dateRangeValue = ref<[Date | null, Date | null] | null>(null);
const dateRangeTimeValue = ref<[Date | null, Date | null] | null>(null);
const dateRangeMaxValue = ref<[Date | null, Date | null] | null>(null);
const dateRangeMinValue = ref<[Date | null, Date | null] | null>(null);
const dateRangeMinHourValue = ref<[Date | null, Date | null] | null>(null);

// Результаты фильтрации
const filterResults = ref<Record<string, any>>({});

// Функция для получения предложений тегов
const getSuggestedTags = (input: string): Promise<string[]> => {
    // Симулируем API-запрос с задержкой
    return new Promise((resolve) => {
        setTimeout(() => {
            const suggestions = [
                'Электроника', 'Смартфоны', 'Ноутбуки', 'Планшеты', 'Аксессуары',
                'Мебель', 'Одежда', 'Обувь', 'Игрушки', 'Спорт', 'Книги'
            ].filter(tag => tag.toLowerCase().includes(input.toLowerCase()));
            resolve(suggestions);
        }, 300);
    });
};

// Опции для селектов
const sortOptions = [
    { value: null, label: 'По умолчанию' },
    { value: 'name_asc', label: 'По имени (А-Я)' },
    { value: 'name_desc', label: 'По имени (Я-А)' },
    { value: 'price_asc', label: 'По цене (возрастание)' },
    { value: 'price_desc', label: 'По цене (убывание)' }
];

const statusOptions = [
    { value: null, label: 'Все статусы' },
    { value: 'available', label: 'Доступно' },
    { value: 'unavailable', label: 'Недоступно' },
    { value: 'pending', label: 'В ожидании' }
];

const tagOptions = [
    { value: 'new', label: 'Новинка' },
    { value: 'sale', label: 'Распродажа' },
    { value: 'bestseller', label: 'Хит продаж' },
    { value: 'recommended', label: 'Рекомендуем' },
    { value: 'limited', label: 'Ограниченная серия' }
];

// Обработчик изменений фильтров
const logChange = (filterName: string, value: any) => {
    filterResults.value[filterName] = value;
    console.log(`${filterName} изменен:`, value);
};

// Форматирование результатов для отображения
const formattedResults = computed(() => {
    return JSON.stringify(filterResults.value, null, 2);
});
</script>

<style scoped>
pre {
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
}
</style>
