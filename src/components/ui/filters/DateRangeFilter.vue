<template>
  <BaseFilterWrapper :title="title" :titleColor="titleColor">
    <template #icon>
      <slot name="icon"></slot>
    </template>

    <div class="relative">
      <div
        :class="[
          'h-[46px] w-full border rounded-lg px-2.5 flex items-center relative transition-colors duration-200',
          backgroundColor,
          borderColor,
          'hover:' + borderHoverColor,
          { ['focus-within:' + borderHoverColor]: true }
        ]"
      >
        <!-- Контейнер для диапазона -->
        <RangeTag
          v-if="startDate && endDate"
          :label="formatRangeLabel"
          @remove="handleClear"
        />

        <!-- Placeholder и иконка календаря -->
        <div
          v-if="!startDate || !endDate"
          @click="toggleCalendar"
          :class="[
            'flex items-center gap-2 cursor-pointer',
            { [placeholderColor]: !startDate || !endDate }
          ]"
        >
          <span>{{ placeholder || t("datePicker.selectDateRange") }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Календарь -->
      <Transition name="fade">
        <div
          v-if="showCalendar"
          ref="calendarRef"
          class="absolute z-50 mt-1 calendar-dropdown"
          :class="{ 'right-0': alignRight }"
        >
          <RangeCalendarPicker
            v-model="dateRange"
            :showTime="showTime"
            :minCurrentTimePlusHour="minCurrentTimePlusHour"
            :maxCurrentTime="maxCurrentTime"
            :minDate="minDate"
            :maxDate="maxDate"
            @apply="handleRangeApply"
            @clear="handleClear"
            ref="calendarPickerRef"
          />
        </div>
      </Transition>
    </div>
  </BaseFilterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import BaseFilterWrapper from "./BaseFilterWrapper.vue";
import RangeCalendarPicker from "@/components/ui/calendar/RangeCalendarPicker.vue";
import {
  formatDate,
  formatTime,
  formatDateForServer,
  isToday,
} from "@/utils/formatterUtils";
import FilterTag from "./FilterTag.vue";
import RangeTag from "./RangeTag.vue";

interface DateRangeFilterProps {
  title: string;
  placeholder?: string;
  modelValue: [Date | null, Date | null] | null;
  showTime?: boolean;
  minCurrentTimePlusHour?: boolean;
  maxCurrentTime?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  alignRight?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
  placeholderColor?: string;
}

const props = withDefaults(defineProps<DateRangeFilterProps>(), {
  placeholder: "",
  showTime: false,
  minCurrentTimePlusHour: false,
  maxCurrentTime: false,
  minDate: null,
  maxDate: null,
  alignRight: false,
  backgroundColor: "bg-primary",
  titleColor: "text-text-accent",
  textColor: "text-white",
  borderColor: "border-primary-600",
  borderHoverColor: "border-primary-500",
  placeholderColor: "text-gray-300",
});

const emit = defineEmits<{
  "update:modelValue": [value: [Date | null, Date | null] | null];
  "date-for-server": [value: [string | null, string | null] | null];
}>();

const { t } = useI18n();
const showCalendar = ref(false);
const calendarRef = ref<HTMLDivElement | null>(null);
const dateRange = ref<[Date | null, Date | null] | null>(null);

// Получение значения для отображения
const startDate = computed(() => {
  if (Array.isArray(props.modelValue) && props.modelValue[0]) {
    return new Date(props.modelValue[0]);
  }
  return null;
});

const endDate = computed(() => {
  if (Array.isArray(props.modelValue) && props.modelValue[1]) {
    return new Date(props.modelValue[1]);
  }
  return null;
});

// Инициализация
onMounted(() => {
  // Для режима диапазона
  if (Array.isArray(props.modelValue)) {
    dateRange.value = [
      props.modelValue[0] ? new Date(props.modelValue[0]) : null,
      props.modelValue[1] ? new Date(props.modelValue[1]) : null,
    ];
  }

  // Добавляем обработчик клика за пределами календаря
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Методы
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const calendar = calendarRef.value;

  // Если клик был по самому календарю или внутри него, не закрываем его
  if (calendar && calendar.contains(target)) {
    return;
  }

  // Находим элемент, который открыл календарь
  const datePickerTrigger = document.querySelector('.date-time-picker [class*="border"]');

  // Если клик был по триггеру, не закрываем календарь (этим занимается toggleCalendar)
  if (datePickerTrigger && datePickerTrigger.contains(target)) {
    return;
  }

  // Во всех остальных случаях закрываем календарь
  showCalendar.value = false;
};

// Обработчик для диапазона дат
const handleRangeApply = (range: [Date | null, Date | null] | null) => {
  // Проверяем на минимальное время (час вперед)
  if (range && range[0] && props.minCurrentTimePlusHour && isToday(range[0])) {
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 1);

    if (range[0] < minTime) {
      // Если выбранное время меньше минимального, корректируем его
      range[0] = new Date(minTime);
    }
  }

  // Проверяем на максимальное время (текущее)
  if (range && range[0] && props.maxCurrentTime && isToday(range[0])) {
    const maxTime = new Date();

    if (range[0] > maxTime) {
      // Если выбранное время больше максимального, корректируем его
      range[0] = new Date(maxTime);
    }
  }

  emit("update:modelValue", range);
  showCalendar.value = false; // Важно закрывать календарь при применении!

  // Преобразуем форматы для сервера
  if (range) {
    const serverDates: [string | null, string | null] = [
      range[0] ? formatDateForServer(range[0]) : null,
      range[1] ? formatDateForServer(range[1]) : null,
    ];
    emit("date-for-server", serverDates);
  } else {
    emit("date-for-server", null);
  }
};

// Добавляем реф для хранения ссылки на компонент календаря
import { ref as vueRef } from "vue";
const calendarPickerRef = vueRef<InstanceType<typeof RangeCalendarPicker> | null>(null);

// Добавляем новый обработчик для события clear
const handleClear = () => {
  emit("update:modelValue", null);
  emit("date-for-server", null);
  showCalendar.value = false;
};

// Форматирование метки диапазона
const formatRangeLabel = computed(() => {
  if (!startDate.value || !endDate.value) return '';
  
  const start = formatDate(startDate.value);
  const end = formatDate(endDate.value);
  const startTime = props.showTime ? formatTime(startDate.value) : '';
  const endTime = props.showTime ? formatTime(endDate.value) : '';
  
  return `${start}${startTime ? ' ' + startTime : ''} - ${end}${endTime ? ' ' + endTime : ''}`;
});

// Отслеживаем изменения modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    if (Array.isArray(newValue)) {
      dateRange.value = [
        newValue[0] ? new Date(newValue[0]) : null,
        newValue[1] ? new Date(newValue[1]) : null,
      ];
    } else {
      dateRange.value = null;
    }
  }
);
</script>

<style scoped>
.date-time-picker {
  position: relative;
}

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
