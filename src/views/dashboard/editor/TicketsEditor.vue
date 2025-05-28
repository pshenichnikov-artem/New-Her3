<template>
    <BaseEditor :title="isEditMode ? t('ticket.edit') : t('ticket.create')" :back-path="'/dashboard/tickets'"
        :is-loading="ticketApi.isLoading" :has-changes="hasChanges" @back="goBack" @cancel="resetForm"
        @save="form.handleSubmit(saveTicket)">

        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin text-4xl text-primary-600">
                <i class="fas fa-spinner"></i>
            </div>
        </div>
        <div v-else-if="ticketForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Основная информация -->
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="eventId" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('ticket.fields.eventId') }}
                        </label>
                        <select id="eventId" v-model="ticketForm.eventId"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light"
                            :class="{ 'border-red-500': !form.validationState.eventId }"
                            :disabled="isReadOnly || isEditMode">
                            <option value="">{{ t('ticket.selectEvent') }}</option>
                            <option v-for="event in events" :key="event.id" :value="event.id">
                                {{ event.title }}
                            </option>
                        </select>
                        <p v-if="!form.validationState.eventId && form.validationTrigger.eventId"
                            class="text-red-500 text-sm mt-1">
                            {{ t('validation.required') }}
                        </p>
                    </div>

                    <div v-if="isEditMode" class="form-group">
                        <label for="status" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('ticket.fields.status') }}
                        </label>
                        <select id="status" v-model="ticketForm.status"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light" :disabled="isReadOnly">
                            <option value="Available">{{ t('ticket.statuses.available') }}</option>
                            <option value="Reserved">{{ t('ticket.statuses.reserved') }}</option>
                            <option value="Sold">{{ t('ticket.statuses.sold') }}</option>
                            <option value="Cancelled">{{ t('ticket.statuses.cancelled') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Дополнительная информация (только для режима редактирования) -->
                <div v-if="isEditMode" class="space-y-4">
                    <div class="form-group">
                        <label for="attendeeId" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('ticket.fields.attendeeId') }}
                        </label>
                        <select id="attendeeId" v-model="ticketForm.attendeeId"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light" :disabled="isReadOnly">
                            <option value="">{{ t('ticket.noAttendee') }}</option>
                            <option v-for="attendee in attendees" :key="attendee.id" :value="attendee.id">
                                {{ attendee.fullName }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="buyerId" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('ticket.fields.buyerId') }}
                        </label>
                        <select id="buyerId" v-model="ticketForm.buyerId"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light" :disabled="isReadOnly">
                            <option value="">{{ t('ticket.noBuyer') }}</option>
                            <option v-for="user in users" :key="user.id" :value="user.id">
                                {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                            </option>
                        </select>
                    </div>

                    <div v-if="ticketData?.qrCode" class="form-group">
                        <label class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('ticket.fields.qrCode') }}
                        </label>
                        <div class="p-3 bg-gray-100 rounded-lg">
                            <code class="text-sm">{{ ticketData.qrCode }}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useTicketApi } from '@/composables/api/useTicketApi';
import { useEventApi } from '@/composables/api/useEventApi';
import { useUserApi } from '@/composables/api/useUserApi';
import { useAttendeeApi } from '@/composables/api/useAttendeeApi';
import type { TicketAddRequest } from '@/types/ticket/TicketAddRequest';
import type { TicketUpdateRequest } from '@/types/ticket/TicketUpdateRequest';
import type { TicketResponse } from '@/types/ticket/TicketResponse';
import type { EventResponse } from '@/types/event/EventResponse';
import type { UserResponse } from '@/types/user/UserResponse';
import type { AttendeeResponse } from '@/types/attendee/AttendeeResponse';
import BaseEditor from '@/components/editors/BaseEditor.vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import { TicketStatus } from '@/types/enums/TicketStatus';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const ticketApi = useTicketApi();
const eventApi = useEventApi();
const userApi = useUserApi();
const attendeeApi = useAttendeeApi();
const notification = useNotification();

const ticketId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-tickets-edit');
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialTicketData = ref<TicketAddRequest | TicketUpdateRequest | null>(null);
const ticketData = ref<TicketResponse | null>(null);

// Создаем форму с правильными типами данных
const ticketForm = ref<TicketAddRequest & Partial<TicketUpdateRequest>>({
    eventId: '',
    status: TicketStatus.Available,
    attendeeId: '',
    buyerId: ''
});

// Настраиваем валидацию формы
const form = useFormValidation(['eventId']);

// Данные для выпадающих списков
const events = ref<EventResponse[]>([]);
const users = ref<UserResponse[]>([]);
const attendees = ref<AttendeeResponse[]>([]);

const hasChanges = computed(() => {
    if (!ticketForm.value || !initialTicketData.value) return false;
    return JSON.stringify(ticketForm.value) !== JSON.stringify(initialTicketData.value);
});

onMounted(async () => {
    isLoading.value = true;

    // Загружаем данные для выпадающих списков
    await loadSelectOptions();

    if (isEditMode.value) {
        await ticketApi.getTicketById(ticketId.value, {
            onSuccess: (ticket) => {
                if (ticket) {
                    ticketData.value = ticket;

                    initialTicketData.value = {
                        status: ticket.status,
                        attendeeId: ticket.attendee?.id || '',
                        buyerId: ticket.payment?.buyerId || ''
                    };

                    ticketForm.value = {
                        eventId: ticket.eventId,
                        status: ticket.status,
                        attendeeId: ticket.attendee?.id || '',
                        buyerId: ticket.payment?.buyerId || ''
                    };
                } else {
                    notification.error(t('errors.ticketNotFound'));
                    goBack();
                }
            },
            onError: () => {
                notification.error(t('errors.loadingFailed'));
                goBack();
            }
        });
    } else {
        ticketForm.value = {
            eventId: '',
            status: TicketStatus.Available,
            attendeeId: '',
            buyerId: ''
        };
        initialTicketData.value = { ...ticketForm.value };
    }

    isLoading.value = false;
});

const loadSelectOptions = async () => {
    // Загружаем события
    await eventApi.searchEvents({
        filter: { eventIds: [], isActive: true },
        sort: [],
        pagination: { page: 1, pageSize: 100 }
    }, {
        onSuccess: (response) => {
            if (response) {
                events.value = response.items;
            }
        }
    });

    // Загружаем пользователей
    await userApi.searchUsers({
        filter: { userIds: [] },
        sort: [],
        pagination: { page: 1, pageSize: 100 }
    }, {
        onSuccess: (response) => {
            if (response) {
                users.value = response.items;
            }
        }
    });

    // Загружаем посетителей
    await attendeeApi.searchAttendees({
        filter: {
            attendeeIds: [],
            fullName: null,
            birthDateFrom: null,
            birthDateTo: null,
            docType: [],
            docNumber: null
        },
        sort: [],
        pagination: { page: 1, pageSize: 100 }
    }, {
        onSuccess: (response) => {
            if (response) {
                attendees.value = response.items;
            }
        }
    });
};

const validateForm = (): boolean => {
    let isValid = true;

    // Проверяем обязательное поле eventId
    if (!ticketForm.value.eventId) {
        form.updateValidationState('eventId', false);
        form.validationTrigger.eventId = (form.validationTrigger.eventId || 0) + 1;
        isValid = false;
    } else {
        form.updateValidationState('eventId', true);
    }

    return isValid;
};

const goBack = () => {
    router.push('/dashboard/tickets');
};

const resetForm = () => {
    if (initialTicketData.value) {
        if (isEditMode.value) {
            ticketForm.value = {
                eventId: ticketData.value?.eventId || '',
                ...(initialTicketData.value as TicketUpdateRequest)
            };
        } else {
            ticketForm.value = { ...(initialTicketData.value as TicketAddRequest) };
        }
    }
    form.resetValidation();
    notification.info(t('common.changesDiscarded'));
};

const saveTicket = async () => {
    if (!validateForm()) {
        return;
    }

    if (isEditMode.value) {
        const updateData: TicketUpdateRequest = {
            status: ticketForm.value.status!,
            attendeeId: ticketForm.value.attendeeId || null,
            buyerId: ticketForm.value.buyerId || null
        };

        await ticketApi.updateTicket(ticketId.value, updateData, {
            onSuccess: () => {
                initialTicketData.value = { ...updateData };
                notification.success(t('ticket.updateSuccess'));
            },
            onError: () => {
                notification.error(t('ticket.updateFailed'));
            }
        });
    } else {
        const addData: TicketAddRequest = {
            eventId: ticketForm.value.eventId
        };

        await ticketApi.createTicket(addData, {
            onSuccess: () => {
                notification.success(t('ticket.createSuccess'));
                router.push('/dashboard/tickets');
            },
            onError: () => {
                notification.error(t('ticket.createFailed'));
            }
        });
    }
};
</script>
