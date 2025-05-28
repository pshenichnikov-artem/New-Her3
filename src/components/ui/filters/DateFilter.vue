<template>
  <BaseFilterWrapper :title="title" :titleColor="titleColor">
    <template #icon>
      <slot name="icon"></slot>
    </template>

    <!-- Выбранные значения для множественного выбора -->
    <div v-if="multipleSelect && selectedValues.length > 0" class="flex flex-wrap mb-2">
      <FilterTag
        v-for="(value, index) in selectedValues"
        :key="index"
        :label="formatDate(value)"
        @remove="removeValue(index)"
      />
    </div>

    <!-- Отображение одиночной даты -->
    <div v-else-if="!multipleSelect && modelValue" class="flex flex-wrap mb-2">
      <div class="w-full text-sm text-gray-600">
        {{ formatDateTime(modelValue as Date) }}
      </div>
    </div>

    <div class="relative date-time-picker">
      <div
        @click="toggleCalendar"
        :class="[
          'w-full border rounded-lg px-3 py-2.5 flex items-center justify-between cursor-pointer transition-all',
          backgroundColor,
          textColor,
          borderColor,
          'hover:' + borderHoverColor,
        ]"
      >
        <span :class="[placeholderColor]">{{
          placeholder || t("datePicker.selectDate")
        }}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
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

      <!-- Календарь -->
      <Transition name="fade">
        <div
          v-if="showCalendar"
          ref="calendarRef"
          class="absolute z-50 mt-1 calendar-dropdown"
          :class="{ 'right-0': alignRight }"
        >
          <!-- Множественный выбор -->
          <div
            v-if="multipleSelect"
            class="mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow"
          >
            <MultiDateCalendarPicker
              v-model="selectedDates"
              @select-date="handleMultipleDateSelect"
              :minDate="minDate"
              :maxDate="maxDate"
              @apply="closeMultiCalendar"
            />
          </div>
          <!-- Одиночный выбор -->
          <div v-else class="bg-white border border-gray-200 rounded-lg shadow">
            <SingleDateCalendarPicker
              v-model="singleDate"
              :showTime="showTime"
              :minCurrentTimePlusHour="minCurrentTimePlusHour"
              :maxCurrentTime="maxCurrentTime"
              :minDate="minDate"
              :maxDate="maxDate"
              @apply="handleSingleDateApply"
            />
          </div>
        </div>
      </Transition>
    </div>
  </BaseFilterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import BaseFilterWrapper from "./BaseFilterWrapper.vue";
import FilterTag from "./FilterTag.vue";
import MultiDateCalendarPicker from "@/components/ui/calendar/MultiDateCalendarPicker.vue";
import SingleDateCalendarPicker from "@/components/ui/calendar/SingleDateCalendarPicker.vue";
import { formatDate, formatDateTime, formatDateForServer } from "@/utils/formatterUtils";

interface DateFilterProps {
  title: string;
  placeholder?: string;
  modelValue: Date | string | string[] | null;
  multipleSelect?: boolean;
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

const props = withDefaults(defineProps<DateFilterProps>(), {
  placeholder: "",
  multipleSelect: false,
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
  "update:modelValue": [value: Date | string[] | null];
  "date-for-server": [value: string | string[] | null];
}>();

const { t } = useI18n();
const showCalendar = ref(false);
const calendarRef = ref<HTMLDivElement | null>(null);
const selectedValues = ref<string[]>([]);
const selectedDates = ref<Date[]>([]);
const singleDate = ref<Date | null>(null);

// Инициализация
onMounted(() => {
  // Для режима множественного выбора
  if (props.multipleSelect && Array.isArray(props.modelValue)) {
    selectedValues.value = [...props.modelValue];
  }
  // Для режима одиночной даты
  else if (!props.multipleSelect && props.modelValue) {
    singleDate.value = new Date(props.modelValue as string | Date);
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

const removeValue = (index: number) => {
  selectedValues.value.splice(index, 1);
  emit("update:modelValue", selectedValues.value);

  // Преобразуем форматы для сервера
  const serverDates = selectedValues.value.map((d) => formatDateForServer(new Date(d)));
  emit("date-for-server", serverDates);
};

// Обработчик для множественного выбора дат
const handleMultipleDateSelect = (date: Date) => {
  // Проверяем, есть ли дата уже в выбранных
  const existingDateIndex = selectedValues.value.findIndex((d) => {
    const existingDate = new Date(d);
    return (
      existingDate.getFullYear() === date.getFullYear() &&
      existingDate.getMonth() === date.getMonth() &&
      existingDate.getDate() === date.getDate()
    );
  });

  if (existingDateIndex >= 0) {
    // Если дата уже выбрана - удаляем её
    selectedValues.value.splice(existingDateIndex, 1);
  } else {
    // Иначе добавляем новую дату
    const dateStr = formatDateForServer(date).split(" ")[0]; // Берем только дату без времени
    selectedValues.value.push(dateStr);
  }

  emit("update:modelValue", selectedValues.value);

  // Преобразуем форматы для сервера
  const serverDates = selectedValues.value.map((d) => formatDateForServer(new Date(d)));
  emit("date-for-server", serverDates);
};

// Обработчик для одиночного выбора даты
const handleSingleDateApply = (date: Date | null) => {
  // Если включено ограничение на минимальное время
  if (date && props.showTime && props.minCurrentTimePlusHour) {
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 1);

    // Проверяем, что выбранное время удовлетворяет ограничению
    if (date.getTime() < minTime.getTime()) {
      // Корректируем время
      date = new Date(minTime);
    }
  }

  // Если включено ограничение на максимальное время
  if (date && props.showTime && props.maxCurrentTime) {
    const maxTime = new Date();

    // Проверяем, что выбранное время удовлетворяет ограничению
    if (date.getTime() > maxTime.getTime()) {
      // Корректируем время
      date = new Date(maxTime);
    }
  }

  emit("update:modelValue", date);

  // Закрываем календарь после применения даты
  showCalendar.value = false;

  // Преобразуем формат для сервера
  if (date) {
    emit("date-for-server", formatDateForServer(date));
  } else {
    emit("date-for-server", null);
  }
};

// Добавляем метод для закрытия календаря множественного выбора
const closeMultiCalendar = () => {
  showCalendar.value = false;
};

// Отслеживаем изменения modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.multipleSelect && Array.isArray(newValue)) {
      selectedValues.value = [...(newValue as string[])];
    } else if (!props.multipleSelect && newValue) {
      singleDate.value = new Date(newValue as string | Date);
    } else {
      singleDate.value = null;
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
