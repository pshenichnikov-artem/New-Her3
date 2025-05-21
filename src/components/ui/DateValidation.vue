<template>
    <div class="flex flex-col h-full">
        <label class="mb-2 text-sm font-medium text-text">{{ label }}</label>
        <div class="relative date-time-picker">
            <div @click="toggleCalendar"
                class="w-full border border-primary-600 rounded-lg px-4 py-2.5 bg-primary text-white flex items-center justify-between cursor-pointer hover:bg-primary-700 hover:border-primary-500 transition-all h-[42px]">
                <span v-if="selectedDate" class="text-white">{{ formatDate(selectedDate) }}</span>
                <span v-else class="text-gray-400">{{ placeholder || t('datePicker.selectDate') }}</span>

                <div class="flex items-center">
                    <slot name="icon">
                        <IconsSet name="calendar" class="h-4 w-4 text-text-accent" />
                    </slot>
                </div>
            </div>

            <!-- Календарь -->
            <Transition name="fade">
                <div v-if="showCalendar" ref="calendarRef" class="absolute z-50 mt-1 calendar-dropdown"
                    :class="{ 'right-0': alignRight }">
                    <div class="bg-white border border-gray-200 rounded-lg shadow">
                        <SingleDateCalendarPicker v-model="singleDate" :showTime="false" :minDate="minDate"
                            :maxDate="maxDate" :initialDate="initialCalendarDate" @apply="handleDateSelect" />
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="text-red-500 text-xs mt-1">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import SingleDateCalendarPicker from '@/components/ui/calendar/SingleDateCalendarPicker.vue';
import { formatDate, formatDateForServer } from '@/utils/formatterUtils';

interface Props {
    modelValue: Date | string | null;
    label: string;
    placeholder?: string;
    minDate?: Date | null;
    maxDate?: Date | null;
    error?: string | null;
    alignRight?: boolean;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    minDate: null,
    maxDate: null,
    error: null,
    alignRight: false,
    id: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: Date | null];
    'date-for-server': [value: string | null];
    'valid': [isValid: boolean];
}>();

const { t } = useI18n();
const showCalendar = ref(false);
const calendarRef = ref<HTMLDivElement | null>(null);
const singleDate = ref<Date | null>(null);
const selectedDate = ref<Date | null>(null);

// Вычисляем начальную дату для календаря
const initialCalendarDate = computed(() => {
    // Если есть максимальная дата и она меньше текущей даты
    if (props.maxDate && props.maxDate < new Date()) {
        return props.maxDate;
    }

    // Если есть выбранная дата, используем ее
    if (selectedDate.value) {
        return selectedDate.value;
    }

    // В противном случае используем текущую дату
    return new Date();
});

// Инициализация
onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);

    if (props.modelValue) {
        if (typeof props.modelValue === 'string') {
            selectedDate.value = new Date(props.modelValue);
            singleDate.value = new Date(props.modelValue);
        } else {
            selectedDate.value = props.modelValue;
            singleDate.value = props.modelValue;
        }
        validateDate(selectedDate.value);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

// Методы
const toggleCalendar = () => {
    showCalendar.value = !showCalendar.value;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const calendar = calendarRef.value;

    if (calendar && !calendar.contains(target)) {
        const picker = document.querySelector('.date-time-picker');
        if (picker && !picker.contains(target)) {
            showCalendar.value = false;
        }
    }
};

const handleDateSelect = (date: Date | null) => {
    selectedDate.value = date;
    singleDate.value = date;
    showCalendar.value = false;

    emit('update:modelValue', date);

    // Отправляем дату для сервера в нужном формате
    if (date) {
        emit('date-for-server', formatDateForServer(date));
    } else {
        emit('date-for-server', null);
    }

    // Валидируем дату
    validateDate(date);
};

const validateDate = (date: Date | null) => {
    if (!date) {
        emit('valid', true);
        return;
    }

    let isValid = true;

    // Проверка на минимальную дату
    if (props.minDate && date < props.minDate) {
        isValid = false;
    }

    // Проверка на максимальную дату
    if (props.maxDate && date > props.maxDate) {
        isValid = false;
    }

    emit('valid', isValid);
};

// Отслеживаем изменения модели
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        if (typeof newValue === 'string') {
            selectedDate.value = new Date(newValue);
            singleDate.value = new Date(newValue);
        } else {
            selectedDate.value = newValue;
            singleDate.value = newValue;
        }
        validateDate(selectedDate.value);
    } else {
        selectedDate.value = null;
        singleDate.value = null;
        emit('valid', true);
    }
});
</script>

<style scoped>
.calendar-dropdown {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Анимация появления и исчезновения */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
