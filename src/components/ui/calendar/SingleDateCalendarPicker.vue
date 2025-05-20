<template>
    <div class="single-date-calendar-picker" @click.stop>
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
                    @click="selectDate(day.date, day.isDisabled)" class="calendar-day" :class="{
                        'text-gray-400': !day.isCurrentMonth,
                        'bg-indigo-600 text-white': day.isSelected,
                        'cursor-pointer hover:bg-indigo-50': !day.isDisabled,
                        'cursor-not-allowed opacity-50': day.isDisabled,
                        'border border-indigo-400': day.isToday && !day.isSelected
                    }">
                    <span>{{ day.dayNumber }}</span>
                </div>
            </div>

            <!-- Блок выбора времени -->
            <div v-if="showTime" class="mt-4 border-t border-gray-200 pt-3 px-4">
                <label class="block text-xs text-gray-500 mb-1">{{ t('datePicker.time') }}</label>
                <div class="flex items-center">
                    <input type="number" v-model="hours" min="0" max="23" @input="validateTimeInput('hours')"
                        class="w-16 px-2 py-1 border border-gray-300 rounded">
                    <span class="mx-1">:</span>
                    <input type="number" v-model="minutes" min="0" max="59" @input="validateTimeInput('minutes')"
                        class="w-16 px-2 py-1 border border-gray-300 rounded">
                </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex justify-between mt-4 px-4">
                <button @click="clearSelection"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    {{ t('datePicker.clear') }}
                </button>
                <button @click="applySelection"
                    class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700" :disabled="!canApply"
                    :class="{ 'opacity-50 cursor-not-allowed': !canApply }">
                    {{ t('datePicker.apply') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getMonthNames, getWeekdayNames, isSameDay, isToday } from '@/utils/formatterUtils';

const { t } = useI18n();

interface DateObject {
    date: Date;
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
    dayNumber: number;
}

interface SingleDateCalendarProps {
    modelValue: Date | null;
    showTime?: boolean;
    minCurrentTimePlusHour?: boolean;
    maxCurrentTime?: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
}

const props = withDefaults(defineProps<SingleDateCalendarProps>(), {
    showTime: false,
    minCurrentTimePlusHour: false,
    maxCurrentTime: false,
    minDate: null,
    maxDate: null
});

const emit = defineEmits<{
    'update:modelValue': [value: Date | null];
    'apply': [value: Date | null];
}>();

// Состояние календаря
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());
const selectedDate = ref<Date | null>(null);

// Состояние времени
const hours = ref(today.getHours());
const minutes = ref(today.getMinutes());

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

const effectiveMinDate = computed(() => {
    if (props.minCurrentTimePlusHour) {
        const minDate = new Date();
        minDate.setHours(minDate.getHours() + 1);
        return minDate;
    }
    return props.minDate ? new Date(props.minDate) : null;
});

const effectiveMaxDate = computed(() => {
    if (props.maxCurrentTime) {
        return new Date();
    }
    return props.maxDate ? new Date(props.maxDate) : null;
});

const canApply = computed(() => {
    return selectedDate.value !== null;
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
    const checkIsDisabled = isDateDisabled(date);
    const checkToday = isToday(date);
    const isSelected = selectedDate.value !== null && isSameDay(date, selectedDate.value);

    return {
        date: new Date(date),
        isCurrentMonth,
        isDisabled: checkIsDisabled,
        isToday: checkToday,
        isSelected,
        dayNumber: date.getDate()
    };
}

function isDateDisabled(date: Date): boolean {
    // Проверяем ограничения по минимальной дате
    if (effectiveMinDate.value) {
        const minDateWithoutTime = new Date(
            effectiveMinDate.value.getFullYear(),
            effectiveMinDate.value.getMonth(),
            effectiveMinDate.value.getDate()
        );
        const dateWithoutTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        if (dateWithoutTime < minDateWithoutTime) {
            return true;
        }
    }

    // Проверяем ограничения по максимальной дате
    if (effectiveMaxDate.value) {
        const maxDateWithoutTime = new Date(
            effectiveMaxDate.value.getFullYear(),
            effectiveMaxDate.value.getMonth(),
            effectiveMaxDate.value.getDate()
        );
        const dateWithoutTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        if (dateWithoutTime > maxDateWithoutTime) {
            return true;
        }
    }

    return false;
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
    // Пустая функция, все обновляется через вычисляемые свойства
}

function selectDate(date: Date, isDisabled: boolean): void {
    if (isDisabled) return;
    selectedDate.value = new Date(date);
}

function validateTimeInput(field: string): void {
    if (field === 'hours') {
        if (hours.value < 0) hours.value = 0;
        if (hours.value > 23) hours.value = 23;
        validateMinTimeConstraint();
    } else if (field === 'minutes') {
        if (minutes.value < 0) minutes.value = 0;
        if (minutes.value > 59) minutes.value = 59;
        validateMinTimeConstraint();
    }
}

// Добавляем функцию для проверки ограничения минимального времени
function validateMinTimeConstraint(): void {
    // Проверка на минимальное время (час вперед)
    if (props.minCurrentTimePlusHour && selectedDate.value && isToday(selectedDate.value)) {
        const minTime = new Date();
        minTime.setHours(minTime.getHours() + 1);

        const currentSelectedTime = new Date(selectedDate.value);
        currentSelectedTime.setHours(hours.value, minutes.value, 0);

        if (currentSelectedTime < minTime) {
            // Если выбранное время меньше минимального, корректируем его
            hours.value = minTime.getHours();
            minutes.value = minTime.getMinutes();
        }
    }
}

function clearSelection(): void {
    selectedDate.value = null;
    emit('update:modelValue', null);
}

function applySelection(): void {
    if (selectedDate.value) {
        const result = new Date(selectedDate.value);
        if (props.showTime) {
            result.setHours(hours.value, minutes.value, 0);

            // Проверяем ограничение на минимальное время (час вперед)
            if (props.minCurrentTimePlusHour && isToday(result)) {
                const minTime = new Date();
                minTime.setHours(minTime.getHours() + 1);

                if (result < minTime) {
                    // Если выбранное время меньше минимального, корректируем его
                    result.setHours(minTime.getHours(), minTime.getMinutes(), 0);
                    hours.value = minTime.getHours();
                    minutes.value = minTime.getMinutes();
                }
            }

            // Проверяем ограничение на максимальное время (текущее)
            if (props.maxCurrentTime && isToday(result)) {
                const maxTime = new Date();

                if (result > maxTime) {
                    // Если выбранное время больше максимального, корректируем его
                    result.setHours(maxTime.getHours(), maxTime.getMinutes(), 0);
                    hours.value = maxTime.getHours();
                    minutes.value = maxTime.getMinutes();
                }
            }
        } else {
            result.setHours(0, 0, 0);
        }
        emit('update:modelValue', result);
        emit('apply', result);
    }
}

// Инициализация компонента
onMounted(() => {
    if (props.modelValue) {
        selectedDate.value = new Date(props.modelValue);
        currentYear.value = selectedDate.value.getFullYear();
        currentMonth.value = selectedDate.value.getMonth();

        if (props.showTime) {
            hours.value = selectedDate.value.getHours();
            minutes.value = selectedDate.value.getMinutes();
        }
    }
});

// Отслеживаем изменения значения извне
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        selectedDate.value = new Date(newValue);

        if (props.showTime) {
            hours.value = selectedDate.value.getHours();
            minutes.value = selectedDate.value.getMinutes();
        }
    } else {
        selectedDate.value = null;
    }
});

// При изменении выбранной даты проверяем ограничения
watch(selectedDate, (newVal) => {
    if (newVal && props.showTime && props.minCurrentTimePlusHour) {
        validateMinTimeConstraint();
    }
});
</script>

<style scoped>
.calendar-day {
    @apply flex items-center justify-center text-center text-sm rounded-full h-8 w-8;
}

.calendar-day:not(.disabled):hover {
    @apply bg-indigo-50;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
