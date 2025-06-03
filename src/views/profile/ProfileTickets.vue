<template>
    <div>
        <h2 class="text-xl font-bold mb-6 text-text-accent">{{ t('profile.tickets.title') }}</h2>

        <!-- Состояние загрузки -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="spinner"></div>
        </div>

        <!-- Сообщение об отсутствии билетов -->
        <div v-else-if="!tickets || tickets.length === 0" class="text-center py-12">
            <div class="text-text-muted text-lg">{{ t('profile.tickets.noTickets') }}</div>
            <p class="mt-2 text-text-muted">{{ t('profile.tickets.buyTicketsMessage') }}</p>
            <router-link to="/events"
                class="inline-block mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-md transition-colors">
                {{ t('profile.tickets.browseEvents') }}
            </router-link>
        </div>

        <!-- Список билетов -->
        <div v-else>
            <!-- Карточки билетов -->
            <div class="space-y-4">
                <div v-for="ticket in tickets" :key="ticket.id"
                    class="bg-primary-700 border border-primary-600 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">

                    <div class="flex flex-col md:flex-row">
                        <!-- Информация о мероприятии -->
                        <div class="p-5 flex-1">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-lg font-bold text-text-accent line-clamp-1">
                                    {{ getEventTitle(ticket.id) || t('profile.tickets.unknownEvent') }}
                                    <!-- Индикатор неактивного или прошедшего события -->
                                    <span v-if="isEventInactive(ticket.id)"
                                        class="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-md">
                                        {{ isEventPassed(ticket.id) ? t('profile.tickets.eventPassed') :
                                            t('profile.tickets.eventInactive') }}
                                    </span>
                                </h3>
                                <span :class="getStatusClass(ticket.payment?.status)"
                                    class="px-3 py-1 rounded-full text-xs font-medium">
                                    {{ t(`statuses.payment.${ticket.payment?.status ?? 'WaitingForPayment'}`) }}
                                </span>
                            </div>

                            <div class="space-y-2">
                                <!-- Дата и время мероприятия -->
                                <div class="flex items-center text-sm text-text-muted">
                                    <IconsSet name="calendar" class="h-4 w-4 mr-2 text-primary-300" />
                                    <span>{{ formatDateTime(getEventStartTime(ticket.id)) }}</span>
                                </div>

                                <!-- Место проведения -->
                                <div class="flex items-center text-sm text-text-muted">
                                    <IconsSet name="location" class="h-4 w-4 mr-2 text-primary-300" />
                                    <span class="line-clamp-1">{{ getEventLocation(ticket.id) ||
                                        t('profile.tickets.locationUnknown') }}</span>
                                </div>

                                <!-- Владелец билета -->
                                <div class="flex items-center text-sm text-text-muted">
                                    <IconsSet name="user" class="h-4 w-4 mr-2 text-primary-300" />
                                    <span>{{ ticket.attendee?.fullName || t('profile.tickets.attendeeUnknown') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- QR-код и действия -->
                        <div
                            class="p-5 bg-primary-800 flex flex-col justify-between items-center border-t md:border-t-0 md:border-l border-primary-600">
                            <!-- QR-код билета -->
                            <div class="bg-white p-2 rounded mb-3 w-32 h-32 flex items-center justify-center">
                                <img v-if="ticket.qrCode" :src="ticket.qrCode" alt="QR Code" class="w-full h-full" />
                                <IconsSet v-else name="qrCode" class="h-16 w-16 text-gray-300" />
                            </div>

                            <!-- Кнопки действий -->
                            <div class="flex space-x-2">
                                <button @click="viewTicketDetails(ticket)"
                                    class="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-md flex items-center text-sm">
                                    <IconsSet name="eye" class="h-4 w-4 mr-1" />
                                    {{ t('profile.tickets.view') }}
                                </button>

                                <button v-if="canDownload(ticket)" @click="downloadTicket(ticket)"
                                    class="px-3 py-1.5 bg-primary-700 hover:bg-primary-600 text-white rounded-md border border-primary-500 flex items-center text-sm">
                                    <IconsSet name="download" class="h-4 w-4 mr-1" />
                                    {{ t('profile.tickets.download') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Пагинация -->
            <div v-if="totalCount > pageSize" class="mt-8">
                <BasePagination :total-items="totalCount" :current-page="currentPage" :page-size="pageSize"
                    @pagination-change="handlePaginationChange" />
            </div>
        </div>

        <!-- Модальное окно с деталями билета -->
        <div v-if="selectedTicket"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div
                class="modal-content bg-primary-800 border border-primary-600 rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
                <!-- Контент модального окна -->
                <div class="relative">
                    <!-- Заголовок модального окна -->
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-text-accent">{{ t('profile.tickets.ticketDetails') }}</h3>
                        <button @click="selectedTicket = null" class="text-text-muted hover:text-white">
                            <IconsSet name="close" class="h-6 w-6" />
                        </button>
                    </div>

                    <!-- Содержимое модального окна -->
                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- Левая колонка - информация о мероприятии -->
                        <div class="flex-1">
                            <h4 class="text-lg font-semibold text-text-accent mb-3">{{
                                t('profile.tickets.eventDetails') }}</h4>
                            <div class="space-y-4">
                                <div class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.title') }}</div>
                                    <div class="text-white">
                                        {{ getEventTitle(selectedTicket.id) || t('profile.tickets.unknownEvent') }}
                                        <!-- Индикатор неактивного или прошедшего события в модальном окне -->
                                        <span v-if="isEventInactive(selectedTicket.id)"
                                            class="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-md">
                                            {{ isEventPassed(selectedTicket.id) ? t('profile.tickets.eventPassed') :
                                                t('profile.tickets.eventInactive') }}
                                        </span>
                                    </div>
                                </div>

                                <div class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.date') }}</div>
                                    <div class="text-white">{{
                                        formatDateTime(getEventStartTime(selectedTicket.id)) }}</div>
                                </div>

                                <div class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.location') }}</div>
                                    <div class="text-white">{{ getEventLocation(selectedTicket.id) ||
                                        t('profile.tickets.locationUnknown') }}</div>
                                </div>

                                <div class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('profile.tickets.ticketStatus')
                                        }}</div>
                                    <div>
                                        <span :class="getStatusClass(selectedTicket.payment?.status)"
                                            class="px-3 py-1 rounded-full text-xs font-medium">
                                            {{ t(`statuses.payment.${selectedTicket.payment?.status ?? 'WaitingForPayment'}`) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Правая колонка - информация о посетителе и QR-код -->
                        <div class="lg:w-2/5">
                            <h4 class="text-lg font-semibold text-text-accent mb-3">{{
                                t('profile.tickets.attendeeDetails') }}</h4>
                            <div class="space-y-4 mb-6">
                                <div class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.fullName') }}</div>
                                    <div class="text-white">{{ selectedTicket.attendee?.fullName ||
                                        t('profile.tickets.attendeeUnknown') }}</div>
                                </div>

                                <div v-if="selectedTicket.attendee?.documentType"
                                    class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.documentType') }}</div>
                                    <div class="text-white">{{
                                        translateDocumentType(selectedTicket.attendee?.documentType) }}</div>
                                </div>

                                <div v-if="selectedTicket.attendee?.documentNumber"
                                    class="bg-primary-700 rounded-lg p-3 border border-primary-600">
                                    <div class="text-sm text-text-muted mb-1">{{ t('fields.documentNumber') }}</div>
                                    <div class="text-white">{{ selectedTicket.attendee?.documentNumber }}</div>
                                </div>
                            </div>

                            <!-- QR-код и кнопка скачивания -->
                            <div class="flex flex-col items-center">
                                <div class="bg-white p-3 rounded mb-3 w-48 h-48 flex items-center justify-center">
                                    <img v-if="selectedTicket.qrCode" :src="selectedTicket.qrCode" alt="QR Code"
                                        class="w-full h-full" />
                                    <IconsSet v-else name="qrCode" class="h-24 w-24 text-gray-300" />
                                </div>

                                <button v-if="canDownload(selectedTicket)" @click="downloadTicket(selectedTicket)"
                                    class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center">
                                    <IconsSet name="download" class="h-5 w-5 mr-2" />
                                    {{ t('profile.tickets.download') }}
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
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTicketApi } from '@/composables/api/useTicketApi';
import { useEventApi } from '@/composables/api/useEventApi';
import { useStatusTranslation } from '@/composables/useStatusTranslation';
import { formatDateTime } from '@/utils/formatterUtils';
import { notificationService } from '@/composables/useNotification';
import type { TicketResponse } from '@/types/ticket/TicketResponse';
import type { EventResponse } from '@/types/event/EventResponse';
import { TicketStatus } from '@/types/enums/TicketStatus';
import type { TicketSearchRequest } from '@/types/ticket/TicketSearchRequest';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import BasePagination from '@/components/ui/BasePagination.vue';

const { t } = useI18n();
const ticketApi = useTicketApi();
const eventApi = useEventApi();
const { translateDocumentType } = useStatusTranslation();

// Состояние компонента
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const selectedTicket = ref<TicketResponse | null>(null);
const tickets = ref<TicketResponse[]>([]);
const events = ref<Map<string, EventResponse>>(new Map());

// Методы для получения данных о событиях
function getEventTitle(eventId: string): string | null {
    return events.value.get(eventId)?.title || null;
}

function getEventStartTime(eventId: string): string | null {
    return events.value.get(eventId)?.startTime || null;
}

function getEventLocation(eventId: string): string | null {
    return events.value.get(eventId)?.location || null;
}

// Проверка активности события
function isEventInactive(eventId: string): boolean {
    const event = events.value.get(eventId);
    if (!event) return false;

    return !event.isActive || isEventPassed(eventId);
}

// Проверка, прошло ли событие
function isEventPassed(eventId: string): boolean {
    const event = events.value.get(eventId);
    if (!event || !event.startTime) return false;

    const eventDate = new Date(event.startTime);
    const now = new Date();

    return eventDate < now;
}

// Методы
async function loadTickets() {
    isLoading.value = true;

    const request: TicketSearchRequest = {
        filter: {
            ticketIds: [], // массив Guid в виде строк
            eventIds: [], // массив Guid в виде строк
            buyerIds: [], // массив Guid в виде строк
            buyerName: null,
            attendeeId: [], // массив Guid в виде строк
            attendeeName: null,
            status: [],
            paymentIds: [] // массив Guid в виде строк
        },
        pagination: {
            page: currentPage.value,
            pageSize: pageSize.value
        },
        sort: [
            { sortBy: 'createdAt', sortDirection: 'desc' }
        ]
    };

    const result = await ticketApi.getMyTickets(request);

    if (result) {
        tickets.value = result.items || [];
        totalCount.value = result.totalCount || 0;

        // Собираем все уникальные eventId из билетов
        const eventIds = new Set<string>();
        tickets.value.forEach(ticket => {
            if (ticket.id) {
                eventIds.add(ticket.id);
            }
        });

        // Загружаем детали событий
        await loadEventDetails(Array.from(eventIds));
    } else {
        tickets.value = [];
        totalCount.value = 0;
    }

    isLoading.value = false;
}

async function loadEventDetails(eventIds: string[]) {
    if (eventIds.length === 0) return;

    // Загружаем данные о каждом событии отдельно
    for (const eventId of eventIds) {
        const event = await eventApi.getEventById(eventId, {
            showSuccessNotification: false,
            showErrorNotification: false
        });

        if (event) {
            events.value.set(eventId, event);
        }
    }
}

function viewTicketDetails(ticket: TicketResponse) {
    selectedTicket.value = ticket;
}

function getTicketStatus(ticket: TicketResponse): string {
    if (!ticket.payment) {
        return 'Pending';
    }
    
    switch (ticket.payment.status) {
        case 0:
            return 'WaitingForPayment';
        case 1:
            return 'Successed';
        case 2:
            return 'Cancelled';
        default:
            return 'Failed';
    }
}

function getStatusClass(paymentStatus: number | null): string {
    switch (paymentStatus) {
        case 1: // Paid
            return 'bg-green-100 text-green-800';
        case 0: // Pending
            return 'bg-yellow-100 text-yellow-800';
        case 2: // Cancelled
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-red-800';
    }
}

function canDownload(ticket: TicketResponse): boolean {
    return ticket.payment?.status === 1; // Only paid tickets can be downloaded
}

function downloadTicket(ticket: TicketResponse) {
    // В реальном приложении здесь был бы запрос на скачивание PDF билета
    notificationService.success(t('profile.tickets.downloadStarted'));

    // Симуляция скачивания билета
    setTimeout(() => {
        console.log('Downloading ticket:', ticket.id);
    }, 500);
}

function handlePaginationChange(event: { page: number, pageSize: number }) {
    currentPage.value = event.page;
    pageSize.value = event.pageSize;
    loadTickets();
}

// Инициализация
onMounted(() => {
    loadTickets();
});
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<!-- Добавляем глобальные стили для модального окна -->
<style>
/* Это гарантирует, что модальное окно будет непрозрачным */
.modal-content {
    background-color: #3a205f !important;
    /* Соответствует primary-800 */
    opacity: 1 !important;
}
</style>
