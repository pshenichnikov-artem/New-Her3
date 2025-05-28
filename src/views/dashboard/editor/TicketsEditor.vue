<template>
    <BaseEditor :title="isEditMode ? t('ticket.edit') : t('ticket.create')" :back-path="'/dashboard/tickets'"
        :is-loading="ticketApi.isLoading" :has-changes="hasChanges" @back="goBack" @cancel="resetForm"
        @save="saveTicket">
        <template #actions>
            <button v-if="isEditMode" @click="toggleReadOnly" class="px-4 py-2 rounded-lg transition-colors"
                :class="isReadOnly ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-blue-500 hover:bg-blue-400'">
                {{ isReadOnly ? t('common.buttons.edit') : t('common.buttons.view') }}
            </button>
        </template>

        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin text-4xl text-primary-600">
                <i class="fas fa-spinner"></i>
            </div>
        </div>
        <div v-else-if="ticketForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="eventId" class="block mb-1 font-medium">{{ t('ticket.fields.eventId') }}</label>
                        <select id="eventId" v-model="ticketForm.eventId" class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.eventId }" :disabled="isReadOnly || isEditMode">
                            <option value="">{{ t('ticket.selectEvent') }}</option>
                            <option v-for="event in events" :key="event.id" :value="event.id">
                                {{ event.title }}
                            </option>
                        </select>
                        <p v-if="validationErrors.eventId" class="text-red-500 text-sm mt-1">{{ validationErrors.eventId
                            }}</p>
                    </div>

                    <div class="form-group">
                        <label for="userId" class="block mb-1 font-medium">{{ t('ticket.fields.userId') }}</label>
                        <select id="userId" v-model="ticketForm.userId" class="w-full px-3 py-2 border rounded-lg"
                            :disabled="isReadOnly">
                            <option value="">{{ t('ticket.assignLater') }}</option>
                            <option v-for="user in users" :key="user.id" :value="user.id">
                                {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                            </option>
                        </select>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="form-group">
                        <label for="price" class="block mb-1 font-medium">{{ t('ticket.fields.price') }}</label>
                        <input type="number" id="price" v-model.number="ticketForm.price" step="0.01" min="0"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.price }" :readonly="isReadOnly">
                        <p v-if="validationErrors.price" class="text-red-500 text-sm mt-1">{{ validationErrors.price }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="status" class="block mb-1 font-medium">{{ t('ticket.fields.status') }}</label>
                        <select id="status" v-model="ticketForm.status" class="w-full px-3 py-2 border rounded-lg"
                            :disabled="isReadOnly">
                            <option value="Available">{{ t('ticket.statuses.available') }}</option>
                            <option value="Reserved">{{ t('ticket.statuses.reserved') }}</option>
                            <option value="Sold">{{ t('ticket.statuses.sold') }}</option>
                            <option value="Cancelled">{{ t('ticket.statuses.cancelled') }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref, reactive } from 'vue';
import { useTicketApi } from '@/composables/api/useTicketApi';
import type { TicketUpdateRequest } from '@/types/ticket/TicketUpdateRequest';
import type { EventResponse } from '@/types/event/EventResponse';
import type { UserResponse } from '@/types/user/UserResponse';
import BaseEditor from '@/components/editors/BaseEditor.vue';
import { useEventApi } from '@/composables/api/useEventApi';
import { useUserApi } from '@/composables/api/useUserApi';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const ticketApi = useTicketApi();
const eventApi = useEventApi();
const userApi = useUserApi();

const ticketId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-tickets-edit');
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialTicketData = ref<TicketUpdateRequest | null>(null);
const ticketForm = ref<TicketUpdateRequest | null>(null);
const validationErrors = reactive<Record<string, string>>({});
const events = ref<EventResponse[]>([]);
const users = ref<UserResponse[]>([]);

const hasChanges = computed(() => {
    if (!ticketForm.value || !initialTicketData.value) return false;
    return JSON.stringify(ticketForm.value) !== JSON.stringify(initialTicketData.value);
});

onMounted(async () => {
    isLoading.value = true;

    // Загружаем список мероприятий и пользователей для выпадающих списков
    const eventsResponse = await eventApi.searchEvents({
        pageNumber: 1,
        pageSize: 100,
        filter: {}
    });

    if (eventsResponse) {
        events.value = eventsResponse.items;
    }

    const usersResponse = await userApi.searchUsers({
        pageNumber: 1,
        pageSize: 100,
        filter: {}
    });

    if (usersResponse) {
        users.value = usersResponse.items;
    }

    if (isEditMode.value) {
        isReadOnly.value = true;
        const ticket = await ticketApi.getTicketById(ticketId.value);
        if (ticket) {
            initialTicketData.value = {
                eventId: ticket.eventId,
                userId: ticket.userId,
                price: ticket.price,
                status: ticket.status
            };
            ticketForm.value = { ...initialTicketData.value };
        }
    } else {
        ticketForm.value = {
            eventId: '',
            userId: '',
            price: 0,
            status: 'Available'
        };
        initialTicketData.value = { ...ticketForm.value };
    }

    isLoading.value = false;
});

const goBack = () => {
    router.push('/dashboard/tickets');
};

const resetForm = () => {
    if (initialTicketData.value) {
        ticketForm.value = { ...initialTicketData.value };
    }
    validationErrors = reactive<Record<string, string>>({});
};

const toggleReadOnly = () => {
    isReadOnly.value = !isReadOnly.value;
};

const validateForm = () => {
    validationErrors = reactive<Record<string, string>>({});
    let isValid = true;

    if (!ticketForm.value) return false;

    if (!ticketForm.value.eventId) {
        validationErrors.eventId = t('validation.required');
        isValid = false;
    }

    if (ticketForm.value.price < 0) {
        validationErrors.price = t('validation.positive');
        isValid = false;
    }

    return isValid;
};

const saveTicket = async () => {
    if (!ticketForm.value || !validateForm()) return;

    if (isEditMode.value) {
        const result = await ticketApi.updateTicket(ticketId.value, ticketForm.value);
        if (result) {
            initialTicketData.value = { ...ticketForm.value };
            isReadOnly.value = true;
        }
    } else {
        const result = await ticketApi.addTicket(ticketForm.value);
        if (result) {
            router.push('/dashboard/tickets');
        }
    }
};
</script>
