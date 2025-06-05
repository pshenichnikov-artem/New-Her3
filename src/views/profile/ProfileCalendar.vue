<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-text-accent">
      {{ t("profile.calendar.title") }}
    </h2>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="spinner"></div>
    </div>

    <!-- Календарь -->
    <div v-else>
      <!-- Навигация по месяцам с расширенными опциями -->
      <div class="bg-primary-700 rounded-lg p-4 border border-primary-600 mb-6">
        <div class="flex justify-between items-center mb-3">
          <button
            @click="prevMonth"
            class="p-2 rounded-full hover:bg-primary-600 focus:outline-none"
          >
            <IconsSet name="arrowLeft" class="h-5 w-5 text-text-muted" />
          </button>
          <div class="text-xl font-semibold text-text-accent">
            {{ currentMonthName }} {{ currentYear }}
          </div>
          <button
            @click="nextMonth"
            class="p-2 rounded-full hover:bg-primary-600 focus:outline-none"
          >
            <IconsSet name="arrowRight" class="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <!-- Быстрый выбор месяца и года -->
        <div class="flex gap-3 justify-center">
          <div class="relative">
            <select
              v-model="currentMonth"
              class="py-1 px-3 pr-8 bg-primary-600 border border-primary-500 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-text-accent text-black"
            >
              <option
                v-for="(month, index) in getMonthNames()"
                :key="index"
                :value="index"
              >
                {{ month }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
            >
              <IconsSet name="chevronDown" class="h-4 w-4 text-text-muted" />
            </div>
          </div>

          <div class="relative">
            <select
              v-model="currentYear"
              class="py-1 px-3 pr-8 bg-primary-600 border border-primary-500 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-text-accent text-black"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
            >
              <IconsSet name="chevronDown" class="h-4 w-4 text-text-muted" />
            </div>
          </div>

          <button
            @click="goToToday"
            class="py-1 px-3 bg-primary-600 hover:bg-primary-500 border border-primary-500 rounded-md text-text transition-colors"
          >
            {{ t("profile.calendar.today") }}
          </button>
        </div>
      </div>

      <!-- Дни недели -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-sm font-medium text-text-accent py-2 bg-primary-700 rounded-md"
        >
          {{ day }}
        </div>
      </div>

      <!-- Дни месяца -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="day.isCurrentMonth && openDay(day)"
          :class="{
            'min-h-24 p-2 relative rounded-md overflow-hidden transition-all duration-200': true,
            'bg-primary-700 border border-primary-600 hover:bg-primary-600 cursor-pointer':
              day.isCurrentMonth,
            'bg-primary-800 border border-primary-700 opacity-60': !day.isCurrentMonth,
            'border-text-accent': day.isToday,
          }"
        >
          <!-- Дата -->
          <div class="text-right text-sm mb-1">
            <span
              :class="{
                'inline-block w-6 h-6 rounded-full text-center leading-6': true,
                'bg-text-accent text-primary-800 font-bold': day.isToday,
                'text-text': !day.isToday,
              }"
            >
              {{ day.dayNumber }}
            </span>
          </div>

          <!-- События дня -->
          <div class="space-y-1">
            <template
              v-for="(event, eventIndex) in getEventsForDay(day.date)"
              :key="`${index}-${eventIndex}`"
            >
              <div
                @click.stop="selectEvent(event)"
                class="cursor-pointer p-1.5 text-xs rounded-md truncate hover:brightness-110 transition-all shadow-sm"
                :class="getEventClasses(event)"
              >
                <div class="flex items-center">
                  <span class="truncate">{{ event.event.title }}</span>
                  <IconsSet
                    v-if="event.note"
                    name="note"
                    class="h-3 w-3 ml-1 flex-shrink-0"
                  />
                </div>
              </div>
            </template>

            <!-- Индикатор количества событий, если их больше 3 -->
            <div
              v-if="getEventsForDay(day.date).length > 3"
              class="text-xs text-text-muted text-right mt-1"
            >
              +{{ getEventsForDay(day.date).length - 3 }}
              {{ t("profile.calendar.moreEvents") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Легенда календаря -->
      <div
        class="mt-6 flex flex-wrap items-center gap-6 p-4 bg-primary-700 rounded-lg border border-primary-600"
      >
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-sm"></div>
          <span class="text-xs text-text-muted">{{
            t("profile.calendar.withReminder")
          }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-sky-500 mr-2 shadow-sm"></div>
          <span class="text-xs text-text-muted">{{
            t("profile.calendar.withNote")
          }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-indigo-400 mr-2 shadow-sm"></div>
          <span class="text-xs text-text-muted">{{
            t("profile.calendar.standard")
          }}</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-rose-500 mr-2 shadow-sm"></div>
          <span class="text-xs text-text-muted">{{
            t("profile.calendar.inactive")
          }}</span>
        </div>
      </div>

      <!-- Модальное окно дня -->
      <div
        v-if="selectedDay"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-gradient-to-br from-primary-800 to-primary-900 border border-primary-500 rounded-xl w-full max-w-2xl p-0 relative max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <!-- Заголовок -->
          <div class="bg-primary-700 p-4 rounded-t-xl border-b border-primary-500">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-text-accent">
                {{ formatDate(selectedDay.date) }}
              </h3>
              <button
                @click="closeSelectedDay"
                class="text-text-muted hover:text-white p-1 rounded-full hover:bg-primary-600"
              >
                <IconsSet name="close" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Содержимое -->
          <div class="p-6 space-y-6">
            <!-- События дня -->
            <div v-if="getEventsForDay(selectedDay.date).length" class="space-y-3">
              <h4 class="text-lg font-medium text-text-accent">
                {{ t("profile.calendar.eventsForDay") }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="event in getEventsForDay(selectedDay.date)"
                  :key="event.id"
                  @click="selectEvent(event)"
                  class="p-3 border border-primary-600 rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-medium text-text-accent">
                        {{ event.event.title }}
                      </div>
                      <div class="text-sm text-text-muted">
                        {{ formatTime(event.event.startTime) }}
                      </div>
                    </div>
                    <div
                      :class="{
                        'px-2 py-1 text-xs rounded-full': true,
                        'bg-emerald-800 text-emerald-100': event.event.isActive,
                        'bg-rose-800 text-rose-100': !event.event.isActive,
                      }"
                    >
                      {{
                        event.event.isActive
                          ? t("profile.calendar.active")
                          : t("profile.calendar.inactive")
                      }}
                    </div>
                  </div>
                  <div
                    v-if="event.note"
                    class="mt-2 text-sm text-text-muted flex items-center"
                  >
                    <IconsSet name="note" class="h-4 w-4 mr-1 text-sky-400" />
                    <span class="italic truncate">{{ event.note }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-text-muted py-4">
              {{ t("profile.calendar.noEvents") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно события -->
      <div
        v-if="selectedEvent"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      >
        <div
          class="modal-content bg-gradient-to-br from-primary-800 to-primary-900 border border-primary-500 rounded-xl w-full max-w-2xl p-0 relative max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <!-- Заголовок -->
          <div class="bg-primary-700 p-4 rounded-t-xl border-b border-primary-500">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-text-accent pr-8">
                {{ selectedEvent.event.title }}
              </h3>
              <button
                @click="closeSelectedEvent"
                class="text-text-muted hover:text-white p-1 rounded-full hover:bg-primary-600"
              >
                <IconsSet name="close" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Содержимое -->
          <div class="p-6 relative">
            <!-- Информация о событии -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center space-x-2 text-text-muted">
                <IconsSet name="calendar" class="h-5 w-5 text-text-accent" />
                <span>{{ formatDateTime(selectedEvent.event.startTime) }}</span>
              </div>

              <div class="flex items-center space-x-2 text-text-muted">
                <IconsSet name="location" class="h-5 w-5 text-text-accent" />
                <span>{{ selectedEvent.event.location }}</span>
              </div>

              <div
                v-if="selectedEvent.event.price"
                class="flex items-center space-x-2 text-text-muted"
              >
                <IconsSet name="ticket" class="h-5 w-5 text-text-accent" />
                <span>{{ selectedEvent.event.price }}</span>
              </div>

              <div
                :class="{
                  'flex items-center space-x-2 text-xs py-1.5 px-4 rounded-full w-fit': true,
                  'bg-emerald-900 text-emerald-100': selectedEvent.event.isActive,
                  'bg-rose-900 text-rose-100': !selectedEvent.event.isActive,
                }"
              >
                <IconsSet
                  :name="selectedEvent.event.isActive ? 'check' : 'close'"
                  class="h-4 w-4"
                />
                <span>{{
                  selectedEvent.event.isActive
                    ? t("profile.calendar.active")
                    : t("profile.calendar.inactive")
                }}</span>
              </div>
            </div>

            <!-- Описание -->
            <div
              class="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-primary-500 shadow-inner"
            >
              <h4 class="font-medium text-text-accent mb-2">
                {{ t("profile.calendar.description") }}
              </h4>
              <div class="text-sm text-text leading-relaxed">
                {{ selectedEvent.event.description }}
              </div>
            </div>

            <!-- Форма заметки -->
            <div
              class="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-primary-500 shadow-inner"
            >
              <h4 class="font-medium text-text-accent mb-2 flex items-center">
                <IconsSet name="note" class="h-5 w-5 mr-2 text-sky-400" />
                {{ t("profile.calendar.note") }}
              </h4>
              <textarea
                v-model="noteText"
                class="w-full bg-primary-600/70 border border-primary-500 rounded-md p-3 text-black resize-none focus:outline-none focus:border-text-accent"
                :placeholder="t('profile.calendar.notePlaceholder')"
                rows="4"
              ></textarea>
            </div>

            <!-- Настройка напоминания -->
            <div
              class="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-primary-500 shadow-inner"
            >
              <h4 class="font-medium text-text-accent mb-2 flex items-center">
                <IconsSet name="bell" class="h-5 w-5 mr-2 text-emerald-400" />
                {{ t("profile.calendar.reminder") }}
              </h4>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="useReminder"
                    class="form-checkbox h-5 w-5 text-emerald-500 rounded focus:ring-emerald-500"
                  />
                  <span class="ml-2 text-text">{{
                    t("profile.calendar.enableReminder")
                  }}</span>
                </label>

                <div v-if="useReminder" class="relative">
                  <button
                    @click="toggleReminderPicker"
                    class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md flex items-center"
                  >
                    <span>{{
                      reminderDate
                        ? formatDateTime(reminderDate)
                        : t("profile.calendar.setReminder")
                    }}</span>
                    <IconsSet name="calendar" class="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>

              <!-- Календарь выбора даты -->
              <div
                v-if="showReminderPicker"
                class="fixed z-50 date-picker-overlay"
                @click.self="showReminderPicker = false"
              >
                <div class="date-picker-container">
                  <SingleDateCalendarPicker
                    v-model="reminderDate"
                    :show-time="true"
                    @apply="applyReminderDate"
                    class="calendar-popup shadow-2xl"
                  />
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex justify-between">
              <button
                @click="showEventDetails"
                class="px-4 py-2 bg-primary-700 border border-primary-600 text-text hover:bg-primary-600 rounded-md shadow transition-colors"
              >
                {{ t("profile.calendar.goToEvent") }}
              </button>
              <div class="space-x-2">
                <button
                  @click="saveCalendarEvent"
                  class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow transition-colors"
                >
                  {{ t("profile.calendar.save") }}
                </button>
                <button
                  v-if="isEventInUserCalendar"
                  @click="removeFromCalendar"
                  class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md shadow transition-colors"
                >
                  {{ t("profile.calendar.remove") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useCalendarApi } from "@/composables/api/useCalendarApi";
import { useEventApi } from "@/composables/api/useEventApi";
import IconsSet from "@/components/ui/icons/IconsSet.vue";
import SingleDateCalendarPicker from "@/components/ui/calendar/SingleDateCalendarPicker.vue";
import {
  formatDateTime,
  getWeekdayNames,
  getMonthNames,
  isToday,
} from "@/utils/formatterUtils";
import type { UserCalendarResponse } from "@/types/calendar/UserCalendarResponse";
import type { UserCalendarEventResponse } from "@/types/calendar/UserCalendarEventResponse";
import type { EventResponse } from "@/types/event/EventResponse";
import type { UserCalendarAddEventRequest } from "@/types/calendar/UserCalendarAddEventRequest";
import type { UserCalendarUpdateEventRequest } from "@/types/calendar/UserCalendarUpdateEventRequest";
import { notificationService } from "@/composables/useNotification";

const { t } = useI18n();
const router = useRouter();
const calendarApi = useCalendarApi();
const eventApi = useEventApi();

// Состояние календаря
const isLoading = ref(true);
const userCalendar = ref<UserCalendarResponse | null>(null);
const allEvents = ref<EventResponse[]>([]);

// Состояние выбранного события
const selectedEvent = ref<UserCalendarEventResponse | null>(null);
const noteText = ref("");
const useReminder = ref(false);
const reminderDate = ref<Date | null>(null);
const showReminderPicker = ref(false);

// Состояние выбранного дня
const selectedDay = ref<{
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
} | null>(null);

// Текущая дата для календаря
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

// Доступные годы для выбора
const availableYears = computed(() => {
  const years = [];
  const currentRealYear = new Date().getFullYear();
  for (let year = currentRealYear - 5; year <= currentRealYear + 5; year++) {
    years.push(year);
  }
  return years;
});

// Название текущего месяца
const currentMonthName = computed(() => {
  return getMonthNames()[currentMonth.value];
});

// Сокращенные названия дней недели
const daysOfWeek = computed(() => {
  return getWeekdayNames().map((day) => day.substring(0, 3));
});

// Проверка, есть ли событие в календаре пользователя
const isEventInUserCalendar = computed(() => {
  if (!userCalendar.value?.events || !selectedEvent.value) return false;
  return userCalendar.value.events.some((event) => event.id === selectedEvent.value?.id);
});

// Дни текущего календарного месяца
const calendarDays = computed(() => {
  const days = [];

  // Первый день месяца
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  // День недели первого дня (0 - воскресенье, 1 - понедельник, и т.д.)
  let firstDayWeekday = firstDayOfMonth.getDay();
  if (firstDayWeekday === 0) firstDayWeekday = 7; // Переводим воскресенье на позицию 7

  // Количество дней в предыдущем месяце
  const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate();

  // Дни предыдущего месяца
  for (let i = firstDayWeekday - 1; i > 0; i--) {
    const date = new Date(
      currentYear.value,
      currentMonth.value - 1,
      prevMonthDays - i + 1
    );
    days.push({
      date: date,
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
    });
  }

  // Количество дней в текущем месяце
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

  // Дни текущего месяца
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    days.push({
      date: date,
      dayNumber: date.getDate(),
      isCurrentMonth: true,
      isToday: isToday(date),
    });
  }

  // Дни следующего месяца
  const daysToAdd = 42 - days.length; // 6 строк по 7 дней
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i);
    days.push({
      date: date,
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
    });
  }

  return days;
});

// Функция для получения событий на определенный день (максимум 3 для отображения в календаре)
function getEventsForDay(date: Date) {
  if (!allEvents.value || allEvents.value.length === 0) return [];

  const dayEvents = allEvents.value
    .filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    })
    .map((event) => {
      // Для каждого события находим, есть ли оно в календаре пользователя
      const userEvent = userCalendar.value?.events?.find(
        (userEvent) => userEvent.event.id === event.id
      );

      if (userEvent) {
        return userEvent;
      }

      // Если не найдено, создаем новый объект
      return {
        id: "",
        event: event,
        note: null,
        reminderTime: null,
      };
    });

  return dayEvents;
}

// Форматирование даты без времени
function formatDate(date: Date) {
  return new Intl.DateTimeFormat(document.documentElement.lang || "ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Форматирование только времени
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(document.documentElement.lang || "ru", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Переключение месяцев
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

// Переход к текущей дате
function goToToday() {
  const now = new Date();
  currentMonth.value = now.getMonth();
  currentYear.value = now.getFullYear();
}

// Открытие модального окна для дня
function openDay(day: {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}) {
  selectedDay.value = day;
}

// Закрытие модального окна дня
function closeSelectedDay() {
  selectedDay.value = null;
}

// Показать детали события
function selectEvent(event: UserCalendarEventResponse) {
  selectedEvent.value = event;
  noteText.value = event.note || "";
  useReminder.value = !!event.reminderTime;
  reminderDate.value = event.reminderTime ? new Date(event.reminderTime) : null;

  // Закрываем модальное окно дня если оно открыто
  if (selectedDay.value) {
    selectedDay.value = null;
  }
}

// Закрытие модального окна события
function closeSelectedEvent() {
  selectedEvent.value = null;
  noteText.value = "";
  useReminder.value = false;
  reminderDate.value = null;
}

// Переключение отображения выбора даты для напоминания
function toggleReminderPicker() {
  showReminderPicker.value = !showReminderPicker.value;
}

// Применить выбранную дату напоминания
function applyReminderDate() {
  showReminderPicker.value = false;
}

// Классы для событий в зависимости от статуса
function getEventClasses(event: UserCalendarEventResponse) {
  // Если событие неактивно
  if (!event.event.isActive) {
    return "bg-rose-500 text-white";
  }

  // Если есть напоминание
  if (event.reminderTime) {
    return "bg-emerald-500 text-white";
  }

  // Если есть заметка
  if (event.note) {
    return "bg-sky-500 text-white";
  }

  // По умолчанию
  return "bg-indigo-400 text-white";
}

// Переход к деталям события
function showEventDetails() {
  if (selectedEvent.value) {
    const eventId = selectedEvent.value.event.id;
    selectedEvent.value = null;
    router.push(`/events/${eventId}`);
  }
}

// Загрузка календаря пользователя
async function loadUserCalendar() {
  const calendar = await calendarApi.getMyCalendar({
    showSuccessNotification: false,
    showErrorNotification: true,
  });
  userCalendar.value = calendar;
}

// Загрузка всех событий
async function loadAllEvents() {
  const result = await eventApi.searchEvents(
    {
      filter: {
        eventIds: [],
        description: null,
        dateFrom: null,
        dateTo: null,
        minPrice: null,
        maxPrice: null,
        title: [],
        location: [],
        isActive: null,
        tag: [],
      },
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: [{ sortBy: "startTime", sortDirection: "asc" }],
    },
    {
      showSuccessNotification: false,
      showErrorNotification: true,
    }
  );

  if (result && result.items) {
    allEvents.value = result.items;
  }
}

// Сохранение события в календарь пользователя
async function saveCalendarEvent() {
  if (!selectedEvent.value) return;

  try {
    if (isEventInUserCalendar.value) {
      // Обновление существующего события
      const request: UserCalendarUpdateEventRequest = {
        eventId: selectedEvent.value.event.id,
        note: noteText.value || null,
        reminderTime:
          useReminder.value && reminderDate.value
            ? reminderDate.value.toISOString()
            : null,
      };

      await calendarApi.updateMyEvent(selectedEvent.value.id, request);
      notificationService.success(t("profile.calendar.eventUpdated"));
    } else {
      // Добавление нового события
      const request: UserCalendarAddEventRequest = {
        eventId: selectedEvent.value.event.id,
        note: noteText.value || null,
        reminderTime:
          useReminder.value && reminderDate.value
            ? reminderDate.value.toISOString()
            : null,
      };

      await calendarApi.addMyEvent(request);
      notificationService.success(t("profile.calendar.eventAdded"));
    }

    // Обновляем календарь
    await loadUserCalendar();
    closeSelectedEvent();
  } catch (error) {
    console.error("Error saving calendar event:", error);
    notificationService.error(t("profile.calendar.saveError"));
  }
}

// Удаление события из календаря пользователя
async function removeFromCalendar() {
  if (!selectedEvent.value || !isEventInUserCalendar.value) return;

  try {
    await calendarApi.deleteMyEvent(selectedEvent.value.id);
    notificationService.success(t("profile.calendar.eventRemoved"));

    // Обновляем календарь
    await loadUserCalendar();
    closeSelectedEvent();
  } catch (error) {
    console.error("Error removing calendar event:", error);
    notificationService.error(t("profile.calendar.removeError"));
  }
}

// Инициализация
async function initialize() {
  isLoading.value = true;

  try {
    await Promise.all([loadUserCalendar(), loadAllEvents()]);
  } catch (error) {
    console.error("Error initializing calendar:", error);
  } finally {
    isLoading.value = false;
  }
}

// Запуск инициализации при монтировании компонента
onMounted(() => {
  initialize();
});

// Отслеживание изменений при переключении месяцев
watch([currentMonth, currentYear], () => {
  // При необходимости можно добавить логику обновления данных
});
</script>

<style scoped>
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

/* --- Адаптивные стили для мобильных устройств --- */
@media (max-width: 640px) {
  .grid.grid-cols-7.gap-1 > div {
    min-height: 2.5rem !important;
    padding: 0.25rem !important;
  }
  .grid.grid-cols-7.gap-1 {
    gap: 0.25rem !important;
  }
  .bg-primary-700.rounded-lg.p-4.border {
    padding: 0.75rem !important;
  }
  .mt-6.flex.flex-wrap.items-center.gap-6.p-4.bg-primary-700.rounded-lg.border {
    gap: 0.5rem !important;
    padding: 0.75rem !important;
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .text-xl.font-semibold {
    font-size: 1.1rem !important;
  }
  .text-xl.font-bold {
    font-size: 1.1rem !important;
  }
  .p-6 {
    padding: 1rem !important;
  }
  .max-w-2xl {
    max-width: 98vw !important;
  }
  .rounded-xl {
    border-radius: 0.75rem !important;
  }
  .calendar-popup {
    min-width: 90vw !important;
    max-width: 98vw !important;
  }
}

/* --- Уменьшаем высоту ячеек календаря на мобильных устройствах --- */
@media (max-width: 480px) {
  .grid.grid-cols-7.gap-1 > div {
    min-height: 2rem !important;
    padding: 0.1rem !important;
  }
  .calendar-popup {
    min-width: 98vw !important;
    max-width: 100vw !important;
  }
}
</style>

<style>
.modal-content {
  background-color: #2d1c48 !important;
  opacity: 1 !important;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* Улучшенные стили для SingleDateCalendarPicker */
.single-date-calendar-picker .bg-white {
  background-color: #3a205f !important;
  color: white !important;
  border: 1px solid theme("colors.primary.500");
}

.single-date-calendar-picker .text-gray-500,
.single-date-calendar-picker .text-gray-400,
.single-date-calendar-picker .text-xs {
  color: #b0b0b0 !important;
}

.single-date-calendar-picker .hover\:bg-gray-50:hover,
.single-date-calendar-picker .hover\:bg-gray-100:hover {
  background-color: #563683 !important;
}

.single-date-calendar-picker .bg-indigo-600 {
  background-color: #7f5aa8 !important;
}

.single-date-calendar-picker .hover\:bg-indigo-50:hover {
  background-color: #563683 !important;
}

.single-date-calendar-picker .hover\:bg-indigo-700:hover {
  background-color: #563683 !important;
}

.single-date-calendar-picker .border-indigo-400 {
  border-color: #7f5aa8 !important;
}

/* Исправление для текста в выпадающих списках и полях ввода */
.single-date-calendar-picker select,
.single-date-calendar-picker input {
  background-color: #563683 !important;
  color: white !important;
  border-color: #674296 !important;
  padding: 0.5rem !important;
}

.single-date-calendar-picker .calendar-day {
  color: white !important;
}

/* Исправление для отображения выбранной даты и hover-эффектов */
.single-date-calendar-picker select option {
  background-color: #3a205f;
  color: white;
}

.single-date-calendar-picker input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
