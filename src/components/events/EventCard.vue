<template>
    <div
        class="event-card bg-primary-800 rounded-xl overflow-hidden shadow-xl border border-primary-500 flex flex-col h-full hover:shadow-2xl transition-all transform hover:scale-[1.02] hover:border-primary-400 group">
        <!-- Изображение с градиентной накладкой и кликабельностью -->
        <div class="relative h-52 sm:h-56 md:h-64 overflow-hidden cursor-pointer" @click="navigateToEvent">
            <img v-if="event.images && event.images.length > 0" :src="event.images[0].url" :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div v-else class="w-full h-full bg-primary-700 flex items-center justify-center">
                <IconsSet name="image" class="h-16 w-16 text-primary-300" />
            </div>

            <!-- Градиент поверх изображения для лучшей читаемости -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-70">
            </div>

            <!-- Статус "Неактивно" -->
            <div v-if="!event.isActive"
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md z-10">
                {{ t('modules.events.inactive') }}
            </div>

            <!-- Тег - перемещаем в левый верхний угол -->
            <div v-if="event.tag"
                class="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md z-10 border border-primary-400">
                {{ getTagLabel(event.tag) }}
            </div>
        </div>

        <!-- Информация о мероприятии -->
        <div class="p-5 flex-grow flex flex-col bg-gradient-to-b from-primary-800 to-primary-700">
            <!-- Заголовок и цена -->
            <div class="mb-4">
                <!-- Заголовок также кликабельный -->
                <h3 class="font-bold text-xl text-text-accent line-clamp-2 mb-2 cursor-pointer hover:text-primary-200 transition-colors"
                    @click="navigateToEvent">
                    {{ event.title }}
                </h3>

                <!-- Цена - делаем более заметной и контрастной -->
                <span
                    class="inline-block bg-primary-500 border border-primary-300 text-white font-bold py-1.5 px-4 rounded-lg shadow-md">
                    {{ formattedPrice }}
                </span>
            </div>

            <!-- Дата и время -->
            <div class="flex items-center text-sm text-text-muted mb-2.5">
                <IconsSet name="calendar" class="h-5 w-5 mr-2 text-primary-300" />
                <span>{{ formatEventDate(event.startTime) }}</span>
            </div>

            <!-- Добавляем длительность -->
            <div class="flex items-center text-sm text-text-muted mb-2.5">
                <IconsSet name="clock" class="h-5 w-5 mr-2 text-primary-300" />
                <span>{{ formatDuration }}</span>
            </div>

            <!-- Расположение -->
            <div class="flex items-center text-sm text-text-muted mb-4">
                <IconsSet name="location" class="h-5 w-5 mr-2 text-primary-300" />
                <span class="line-clamp-1">{{ event.location }}</span>
            </div>

            <!-- Описание (обрезанное) -->
            <div class="relative mb-6">
                <p class="text-text text-sm line-clamp-3">{{ event.description }}</p>
                <div v-if="isDescriptionLong"
                    class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary-700 to-transparent"></div>
            </div>

            <!-- Кнопка "Подробнее" - обновленный дизайн -->
            <div class="mt-4 p-2  rounded-lg">
                <router-link :to="`/by-ticket/${event.id}`"
                    class="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 shadow-lg flex items-center justify-center group-hover:shadow-xl transform group-hover:scale-[1.02]">
                    {{ t('modules.events.buyTicket') }}
                    <IconsSet name="arrowRight" class="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'; // Импортируем router
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import type { EventResponse } from '@/types/event/EventResponse';
import { formatDate } from '@/utils/formatterUtils';

// Определение props
interface EventCardProps {
    event: EventResponse;
}

const props = defineProps<EventCardProps>();
const { t } = useI18n();
const router = useRouter(); // Используем router

// Добавляем функцию для перехода на страницу события
const navigateToEvent = () => {
    router.push(`/events/${props.event.id}`);
};

// Форматированная цена
const formattedPrice = computed(() => {
    if (props.event.price === 0) {
        return t('modules.events.free');
    }
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(props.event.price);
});

// Рассчитываем длительность события
const formatDuration = computed(() => {
    const startTime = new Date(props.event.startTime);
    const endTime = new Date(props.event.endTime);

    // Разница в миллисекундах
    const diffMillis = endTime.getTime() - startTime.getTime();

    // Конвертируем в часы и минуты
    const diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));

    // Формируем текст длительности
    if (diffHours > 0) {
        if (diffMinutes > 0) {
            return `${diffHours} ${t('modules.events.time.hours')} ${diffMinutes} ${t('modules.events.time.minutes')}`;
        } else {
            return `${diffHours} ${t('modules.events.time.hours')}`;
        }
    } else {
        return `${diffMinutes} ${t('modules.events.time.minutes')}`;
    }
});

// Проверка длины описания
const isDescriptionLong = computed(() => {
    return props.event.description.length > 150;
});

// Получение метки для тега
const getTagLabel = (tag: string): string => {
    const tagMap: Record<string, string> = {
        'concert': t('modules.events.tags.concert'),
        'festival': t('modules.events.tags.festival'),
        'exhibition': t('modules.events.tags.exhibition'),
        'theater': t('modules.events.tags.theater'),
        'sport': t('modules.events.tags.sport'),
        'workshop': t('modules.events.tags.workshop'),
        'other': t('modules.events.tags.other'),
    };

    return tagMap[tag] || tag;
};

// Форматирование даты мероприятия
const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDate(date);
};
</script>

<style scoped>
.event-card {
    backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-font-smoothing: subpixel-antialiased;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Улучшенная тень для карточки при наведении */
.event-card:hover {
    box-shadow: 0 25px 50px -12px rgba(58, 32, 95, 0.5);
}
</style>
