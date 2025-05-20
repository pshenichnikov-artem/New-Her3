<template>
    <div class="multi-date-calendar-picker" @click.stop>
        <!-- Контейнер календаря -->
        <div class="bg-white rounded-lg py-2">
            <!-- Заголовок и навигация -->
            <div class="flex justify-between items-center mb-4 px-4">
                <button @click="prevMonth" class="p-1 rounded hover:bg-gray-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <select v-model="currentMonth"
                        class="px-2 py-1 border-none bg-transparent focus:outline-none text-center font-medium"
                        @change="updateCalendar">
                        <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
                    </select>
                    <select v-model="currentYear"
                        class="px-2 py-1 border-none bg-transparent focus:outline-none text-center font-medium ml-1"
                        @change="updateCalendar">
                        <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>
                <button @click="nextMonth" class="p-1 rounded hover:bg-gray-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Дни недели -->
            <div class="grid grid-cols-7 mb-2">
                <div v-for="day in daysOfWeek" :key="day" class="text-center text-xs font-medium text-gray-500 py-1">
                    {{ day }}
                </div>
            </div>

            <!-- Календарная сетка -->
            <div class="grid grid-cols-7 gap-1">
                <div v-for="day in calendarDays"
                    :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
                    @click="toggleDateSelection(day.date)" class="calendar-day cursor-pointer" :class="{
                        'text-gray-400': !day.isCurrentMonth,
                        'bg-indigo-600 text-white': day.isSelected,
                        'cursor-pointer hover:bg-indigo-50': true,
                        'border border-indigo-400': day.isToday && !day.isSelected
                    }">
                    <span>{{ day.dayNumber }}</span>
                </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex justify-between mt-4 px-4">
                <button @click="clearSelection"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    {{ t('datePicker.clear') }}
                </button>
                <button @click="applySelection"
                    class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    {{ t('datePicker.apply') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { getMonthNames, getWeekdayNames, isToday, isSameDay } from '@/utils/formatterUtils';

const { t } = useI18n();

interface DateObject {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    dayNumber: number;
}

const props = defineProps({
    modelValue: {
        type: Array as PropType<Date[] | string[]>,
        default: () => []
    },
});

const emit = defineEmits<{
    'update:modelValue': [value: Date[]];
    'select-date': [date: Date];
}>();

// Состояние календаря
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());
const selectedDates = ref<Date[]>([]);

// Константы - с локализацией
const daysOfWeek = computed(() => getWeekdayNames());
const monthNames = computed(() => getMonthNames());

// Вычисляемые свойства
const yearRange = computed(() => {
    const years = [];
    for (let year = 1900; year <= 2100; year++) {
        years.push(year);
    }
    return years;
});

const calendarDays = computed((): DateObject[] => {
    const days: DateObject[] = [];

    // Первый день месяца
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
    // День недели первого дня (0 - воскресенье, 1 - понедельник)
    let firstDayWeekday = firstDayOfMonth.getDay() || 7; // Преобразуем 0 в 7 для воскресенья
    // Количество дней в предыдущем месяце
    const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate();
    // Количество дней в текущем месяце
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

    // Добавляем дни из предыдущего месяца
    for (let i = firstDayWeekday - 1; i > 0; i--) {
        const date = new Date(currentYear.value, currentMonth.value - 1, prevMonthDays - i + 1);
        days.push(createDateObject(date, false));
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear.value, currentMonth.value, i);
        days.push(createDateObject(date, true));
    }

    // Добавляем дни следующего месяца
    const daysToAdd = 42 - days.length; // 6 строк по 7 дней
    for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(currentYear.value, currentMonth.value + 1, i);
        days.push(createDateObject(date, false));
    }

    return days;
});

// Методы
function createDateObject(date: Date, isCurrentMonth: boolean): DateObject {
    const checkToday = isToday(date);
    const isDateSelected = isDateInSelectedDates(date);

    return {
        date: new Date(date),
        isCurrentMonth,
        isToday: checkToday,
        isSelected: isDateSelected,
        dayNumber: date.getDate()
    };
}

function isDateInSelectedDates(date: Date): boolean {
    return selectedDates.value.some(selectedDate => isSameDay(selectedDate, date));
}

function toggleDateSelection(date: Date): void {
    const index = selectedDates.value.findIndex(selectedDate => isSameDay(selectedDate, date));

    if (index !== -1) {
        // Если дата уже выбрана, удаляем её
        selectedDates.value.splice(index, 1);
    } else {
        // Добавляем новую дату
        selectedDates.value.push(new Date(date));
    }

    // Отправляем событие выбора даты
    emit('select-date', new Date(date));
}

function prevMonth(): void {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
}

function nextMonth(): void {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
}

function updateCalendar(): void {
    // Обновляем календарь (пустая функция, т.к. все обновляется через вычисляемые свойства)
}

function clearSelection(): void {
    selectedDates.value = [];
    emit('update:modelValue', []);
}

function applySelection(): void {
    emit('update:modelValue', selectedDates.value);
}

// Инициализация компонента
onMounted(() => {
    // Преобразуем данные из modelValue в даты
    if (props.modelValue && props.modelValue.length > 0) {
        selectedDates.value = props.modelValue.map(date =>
            typeof date === 'string' ? new Date(date) : date
        );
    }
});
</script>

<style scoped>
.calendar-day {
    @apply flex items-center justify-center text-center text-sm rounded-full h-8 w-8;
}

.calendar-day:hover {
    @apply bg-indigo-50;
}
</style>