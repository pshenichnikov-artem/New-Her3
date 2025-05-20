<template>
    <div class="range-calendar-picker" @click.stop>
        <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <!-- Заголовок и навигация -->
            <div class="flex justify-between items-center mb-4">
                <button @click="prevMonth" class="p-1 rounded hover:bg-gray-100 focus:outline-none"
                    :disabled="isPrevMonthDisabled" :class="{ 'opacity-50 cursor-not-allowed': isPrevMonthDisabled }">
                    <IconsSet name="chevron-left" class="h-5 w-5" />
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
                <button @click="nextMonth" class="p-1 rounded hover:bg-gray-100 focus:outline-none"
                    :disabled="isNextMonthDisabled" :class="{ 'opacity-50 cursor-not-allowed': isNextMonthDisabled }">
                    <IconsSet name="chevron-right" class="h-5 w-5" />
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
                        'bg-indigo-600 text-white': day.isStartDate || day.isEndDate,
                        'bg-indigo-100': day.isInRange,
                        'cursor-pointer hover:bg-indigo-50': !day.isDisabled,
                        'cursor-not-allowed opacity-50': day.isDisabled,
                        'border border-indigo-400': day.isToday && !day.isStartDate && !day.isEndDate && !day.isInRange
                    }">
                    <span>{{ day.dayNumber }}</span>
                </div>
            </div>

            <!-- Блок выбора времени -->
            <div v-if="showTime" class="mt-4 border-t border-gray-200 pt-3">
                <div class="grid grid-cols-2 gap-3">
                    <!-- Выбор времени для начальной даты -->
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">{{ t('datePicker.startTime') }}</label>
                        <div class="flex items-center">
                            <input type="number" v-model="startHours" min="0" max="23"
                                @input="validateTimeInput('startHours')"
                                class="w-full px-2 py-1 border border-gray-300 rounded">
                            <span class="mx-1">:</span>
                            <input type="number" v-model="startMinutes" min="0" max="59"
                                @input="validateTimeInput('startMinutes')"
                                class="w-full px-2 py-1 border border-gray-300 rounded">
                        </div>
                    </div>
                    <!-- Выбор времени для конечной даты -->
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">{{ t('datePicker.endTime') }}</label>
                        <div class="flex items-center">
                            <input type="number" v-model="endHours" min="0" max="23"
                                @input="validateTimeInput('endHours')"
                                class="w-full px-2 py-1 border border-gray-300 rounded">
                            <span class="mx-1">:</span>
                            <input type="number" v-model="endMinutes" min="0" max="59"
                                @input="validateTimeInput('endMinutes')"
                                class="w-full px-2 py-1 border border-gray-300 rounded">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex justify-between mt-4">
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
import IconsSet from '@/components/ui/icons/IconsSet.vue';

const { t } = useI18n();

interface DateObject {
    date: Date;
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isToday: boolean;
    isStartDate: boolean;
    isEndDate: boolean;
    isInRange: boolean;
    dayNumber: number;
}

interface RangeCalendarPickerProps {
    modelValue: [Date | null, Date | null] | null;
    showTime?: boolean;
    minCurrentTimePlusHour?: boolean;
    maxCurrentTime?: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
}

const props = withDefaults(defineProps<RangeCalendarPickerProps>(), {
    showTime: false,
    minCurrentTimePlusHour: false,
    maxCurrentTime: false,
    minDate: null,
    maxDate: null
});

const emit = defineEmits<{
    'update:modelValue': [value: [Date | null, Date | null] | null];
    'apply': [value: [Date | null, Date | null] | null];
    'clear': []; // Добавляем новое событие для очистки
}>();

// Состояние календаря
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const selectingEndDate = ref(false);

// Состояние времени
const startHours = ref(today.getHours());
const startMinutes = ref(today.getMinutes());
const endHours = ref(today.getHours());
const endMinutes = ref(today.getMinutes());

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
    return startDate.value !== null;
});

const isPrevMonthDisabled = computed(() => {
    if (!effectiveMinDate.value) return false;

    const firstDayOfPrevMonth = new Date(currentYear.value, currentMonth.value - 1, 1);
    return firstDayOfPrevMonth < new Date(effectiveMinDate.value.getFullYear(), effectiveMinDate.value.getMonth(), 1);
});

const isNextMonthDisabled = computed(() => {
    if (!effectiveMaxDate.value) return false;

    const firstDayOfNextMonth = new Date(currentYear.value, currentMonth.value + 1, 1);
    return firstDayOfNextMonth > new Date(effectiveMaxDate.value.getFullYear(), effectiveMaxDate.value.getMonth(), 1);
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

    let isStartDate = false;
    let isEndDate = false;
    let isInRange = false;

    isStartDate = startDate.value !== null && isSameDay(date, startDate.value);
    isEndDate = endDate.value !== null && isSameDay(date, endDate.value);
    isInRange = isDateInRange(date);

    return {
        date: new Date(date),
        isCurrentMonth,
        isDisabled: checkIsDisabled,
        isToday: checkToday,
        isStartDate,
        isEndDate,
        isInRange,
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

function isDateInRange(date: Date): boolean {
    if (startDate.value === null || endDate.value === null) return false;

    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate.value.getFullYear(), startDate.value.getMonth(), startDate.value.getDate());
    const end = new Date(endDate.value.getFullYear(), endDate.value.getMonth(), endDate.value.getDate());

    return d > start && d < end;
}

function prevMonth(): void {
    if (isPrevMonthDisabled.value) return;

    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
}

function nextMonth(): void {
    if (isNextMonthDisabled.value) return;

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

    if (!selectingEndDate.value || (startDate.value && endDate.value)) {
        // Выбираем начальную дату
        startDate.value = new Date(date);
        endDate.value = null;
        selectingEndDate.value = true;

        // При выборе начальной даты, устанавливаем текущее время
        const now = new Date();
        startHours.value = now.getHours();
        startMinutes.value = now.getMinutes();

        // Устанавливаем конечное время на час больше
        if (startHours.value < 23) {
            endHours.value = startHours.value + 1;
            endMinutes.value = startMinutes.value;
        } else {
            endHours.value = 0;
            endMinutes.value = startMinutes.value;
        }

        // Проверяем временные ограничения
        validateMinTimeConstraint();
    } else {
        // Выбираем конечную дату
        endDate.value = new Date(date);
        selectingEndDate.value = false;

        // Проверяем порядок дат и меняем их местами при необходимости
        if (startDate.value && endDate.value && endDate.value < startDate.value) {
            const temp = startDate.value;
            startDate.value = endDate.value;
            endDate.value = temp;

            // Также меняем местами время
            [startHours.value, endHours.value] = [endHours.value, startHours.value];
            [startMinutes.value, endMinutes.value] = [endMinutes.value, startMinutes.value];

            // После перестановки проверяем минимальное время
            validateMinTimeConstraint();
        }

        // Проверяем, что конечная дата не раньше начальной
        if (startDate.value && endDate.value && isSameDay(startDate.value, endDate.value)) {
            validateEndTime();
        }
    }
}

// Улучшенная функция проверки времени
function validateEndTime(): void {
    // Проверяем только если выбрана одна и та же дата для начала и конца
    if (startDate.value && endDate.value && isSameDay(startDate.value, endDate.value)) {
        // Вычисляем полное время в минутах для корректного сравнения
        const startTimeInMinutes = startHours.value * 60 + startMinutes.value;
        const endTimeInMinutes = endHours.value * 60 + endMinutes.value;

        // Если время окончания меньше времени начала + 60 минут
        if (endTimeInMinutes < startTimeInMinutes + 60) {
            // Проверяем специальный случай для перехода через полночь
            if (startHours.value >= 23) {
                // Переходим на следующий день и сохраняем те же минуты
                const nextDay = new Date(endDate.value);
                nextDay.setDate(nextDay.getDate() + 1);

                // Устанавливаем время: 00:XX, где XX - те же минуты, что и в startMinutes
                endDate.value = nextDay;
                endHours.value = 0;
                endMinutes.value = startMinutes.value;
            } else {
                // В обычном случае просто добавляем 1 час
                endHours.value = startHours.value + 1;
                endMinutes.value = startMinutes.value;
            }
        }
    }
}

// Обработчик изменения времени в инпуте для обеспечения разницы в час
function validateTimeInput(field: string): void {
    switch (field) {
        case 'startHours':
            if (startHours.value < 0) startHours.value = 0;
            if (startHours.value > 23) startHours.value = 23;
            validateEndTime();
            validateMinTimeConstraint();
            break;
        case 'startMinutes':
            if (startMinutes.value < 0) startMinutes.value = 0;
            if (startMinutes.value > 59) startMinutes.value = 59;
            validateEndTime();
            validateMinTimeConstraint();
            break;
        case 'endHours':
            if (endHours.value < 0) endHours.value = 0;
            if (endHours.value > 23) endHours.value = 23;

            // Проверяем минимальную разницу для одного дня
            if (startDate.value && endDate.value && isSameDay(startDate.value, endDate.value)) {
                const startTimeInMinutes = startHours.value * 60 + startMinutes.value;
                const endTimeInMinutes = endHours.value * 60 + endMinutes.value;

                if (endTimeInMinutes < startTimeInMinutes + 60) {
                    // Если после изменения часов разница меньше часа
                    if (startHours.value >= 23) {
                        // Переходим на следующий день
                        const nextDay = new Date(endDate.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        endDate.value = nextDay;
                        endHours.value = 0;
                    } else {
                        endHours.value = startHours.value + 1;
                    }
                }
            }
            break;
        case 'endMinutes':
            if (endMinutes.value < 0) endMinutes.value = 0;
            if (endMinutes.value > 59) endMinutes.value = 59;

            // Проверяем минимальную разницу для одного дня
            if (startDate.value && endDate.value && isSameDay(startDate.value, endDate.value)) {
                const startTimeInMinutes = startHours.value * 60 + startMinutes.value;
                const endTimeInMinutes = endHours.value * 60 + endMinutes.value;

                if (endTimeInMinutes < startTimeInMinutes + 60) {
                    // Если после изменения минут разница меньше часа
                    if (endHours.value === startHours.value) {
                        // Если часы равны, нужно увеличить час окончания
                        if (startHours.value >= 23) {
                            // Переходим на следующий день
                            const nextDay = new Date(endDate.value);
                            nextDay.setDate(nextDay.getDate() + 1);
                            endDate.value = nextDay;
                            endHours.value = 0;
                            endMinutes.value = startMinutes.value;
                        } else {
                            endHours.value = startHours.value + 1;
                            endMinutes.value = startMinutes.value;
                        }
                    } else if (endHours.value === startHours.value + 1 &&
                        endMinutes.value < startMinutes.value) {
                        // Если час на 1 больше, но минуты меньше
                        endMinutes.value = startMinutes.value;
                    }
                }
            }
            break;
    }
}

// Обработчик применения выбора
function applySelection(): void {
    if (startDate.value) {
        const start = new Date(startDate.value);

        if (props.showTime) {
            start.setHours(startHours.value, startMinutes.value, 0);

            // Проверка минимального времени
            if (props.minCurrentTimePlusHour && isToday(start)) {
                const minTime = new Date();
                minTime.setHours(minTime.getHours() + 1);

                if (start < minTime) {
                    // Корректируем время
                    start.setHours(minTime.getHours(), minTime.getMinutes(), 0);
                    startHours.value = minTime.getHours();
                    startMinutes.value = minTime.getMinutes();
                }
            }

            // Проверяем ограничение на максимальное время
            if (props.maxCurrentTime && isToday(start)) {
                const maxTime = new Date();

                if (start > maxTime) {
                    // Корректируем время
                    start.setHours(maxTime.getHours(), maxTime.getMinutes(), 0);
                    startHours.value = maxTime.getHours();
                    startMinutes.value = maxTime.getMinutes();
                }
            }
        } else {
            start.setHours(0, 0, 0);
        }

        let end = null;
        if (endDate.value) {
            end = new Date(endDate.value);

            if (props.showTime) {
                // Проверяем минимальную разницу для одного дня непосредственно перед применением
                if (isSameDay(start, end)) {
                    const startTimeInMinutes = startHours.value * 60 + startMinutes.value;
                    const endTimeInMinutes = endHours.value * 60 + endMinutes.value;

                    if (endTimeInMinutes < startTimeInMinutes + 60) {
                        // Если время окончания меньше времени начала + 1 час
                        if (startHours.value >= 23) {
                            // Создаем новую дату для следующего дня
                            end = new Date(start);
                            end.setDate(end.getDate() + 1);
                            end.setHours(0, startMinutes.value, 0);
                            endHours.value = 0;
                            endMinutes.value = startMinutes.value;
                        } else {
                            // Устанавливаем время на час больше
                            end = new Date(start);
                            end.setHours(startHours.value + 1, startMinutes.value, 0);
                            endHours.value = startHours.value + 1;
                            endMinutes.value = startMinutes.value;
                        }
                    }
                }

                // Применяем обновленное время
                end.setHours(endHours.value, endMinutes.value, 0);
            } else {
                end.setHours(23, 59, 59);
            }
        }

        const result: [Date, Date | null] = [start, end];
        emit('update:modelValue', result);
        emit('apply', result);
    } else {
        emit('update:modelValue', null);
        emit('apply', null);
    }
}

// Сброс выбора дат
function clearSelection(): void {
    startDate.value = null;
    endDate.value = null;
    selectingEndDate.value = false;
    emit('update:modelValue', null);
    emit('clear'); // Добавляем эмит нового события
}

// Инициализация компонента
onMounted(() => {
    if (props.modelValue) {
        if (props.modelValue[0]) {
            startDate.value = new Date(props.modelValue[0]);
            currentYear.value = startDate.value.getFullYear();
            currentMonth.value = startDate.value.getMonth();

            if (props.showTime) {
                startHours.value = startDate.value.getHours();
                startMinutes.value = startDate.value.getMinutes();
            }
        }

        if (props.modelValue[1]) {
            endDate.value = new Date(props.modelValue[1]);

            if (props.showTime) {
                endHours.value = endDate.value.getHours();
                endMinutes.value = endDate.value.getMinutes();
            }
        }
    }
});

// Отслеживаем изменения значения извне
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        if (newValue[0]) {
            startDate.value = new Date(newValue[0]);

            if (props.showTime) {
                startHours.value = startDate.value.getHours();
                startMinutes.value = startDate.value.getMinutes();
            }
        } else {
            startDate.value = null;
        }

        if (newValue[1]) {
            endDate.value = new Date(newValue[1]);

            if (props.showTime) {
                endHours.value = endDate.value.getHours();
                endMinutes.value = endDate.value.getMinutes();
            }
        } else {
            endDate.value = null;
        }
    } else {
        startDate.value = null;
        endDate.value = null;
    }
});

// Улучшенный обработчик наблюдения за временем
watch([startHours, startMinutes, endHours, endMinutes], () => {
    if (startDate.value && endDate.value && isSameDay(startDate.value, endDate.value)) {
        // Проверяем разницу времени
        const startTimeInMinutes = startHours.value * 60 + startMinutes.value;
        const endTimeInMinutes = endHours.value * 60 + endMinutes.value;

        if (endTimeInMinutes < startTimeInMinutes + 60) {
            validateEndTime();
        }
    }
});

function validateMinTimeConstraint(): void {
    // Проверяем только если включено ограничение минимального времени и выбран текущий день
    if (props.minCurrentTimePlusHour && startDate.value && isToday(startDate.value)) {
        const now = new Date();

        // Получаем текущее время без увеличения на час
        const startTime = new Date(startDate.value);
        startTime.setHours(startHours.value, startMinutes.value, 0);

        // Сравниваем с текущим временем
        if (startTime.getTime() <= now.getTime()) {
            // Устанавливаем текущее время
            startHours.value = now.getHours();
            startMinutes.value = now.getMinutes();

            // После изменения начального времени проверяем конечное время
            validateEndTime();
        }
    }
}

// Экспортируем методы, которые нужны извне
defineExpose({
    clearSelection,
    applySelection
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
