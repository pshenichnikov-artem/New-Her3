<template>
  <BaseEditor
    :title="t('ticket.edit')"
    :back-path="'/dashboard/tickets'"
    :is-loading="ticketApi.isLoading"
    :has-changes="hasChanges"
    @back="goBack"
    @cancel="resetForm"
    @save="saveTicket"
  >
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
            <label class="block mb-1 font-medium text-sm text-text-form">
              {{ t("ticket.fields.eventId") }}
            </label>
            <div
              class="bg-primary-800/60 border border-primary-600 rounded-lg p-4 space-y-2"
            >
              <div class="text-white font-medium">{{ ticketData?.event?.title }}</div>
              <div class="text-sm text-gray-400 flex items-center justify-between">
                <span>{{ formatDate(ticketData?.event?.startTime || "") }}</span>
                <span
                  class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200"
                  :title="ticketData?.event?.id"
                  @click="handleCopy(ticketData?.event?.id)"
                >
                  {{
                    copiedId === ticketData?.event?.id
                      ? "Скопировано!"
                      : ticketData?.event?.id
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="block mb-1 font-medium text-sm text-text-form">
              {{ t("ticket.fields.qrCode") }}
            </label>
            <EntityInfo
              :title="ticketData?.qrCode || ''"
              :id="ticketData?.qrCode || ''"
            />
          </div>
        </div>

        <!-- Дополнительная информация -->
        <div class="space-y-4">
          <div class="form-group">
            <label for="attendeeId" class="block mb-1 font-medium text-sm text-text-form">
              {{ t("ticket.fields.attendeeId") }}
            </label>
            <select
              id="attendeeId"
              v-model="ticketForm.attendeeId"
              class="w-full px-3 py-2 border rounded-lg bg-form-light"
              :disabled="isReadOnly"
            >
              <option value="">{{ t("ticket.noAttendee") }}</option>
              <option
                v-for="attendee in attendees"
                :key="attendee.id"
                :value="attendee.id"
              >
                {{ attendee.fullName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="block mb-1 font-medium text-sm text-text-form">
              {{ t("ticket.fields.buyerId") }}
            </label>
            <div
              v-if="ticketData?.payment"
              class="bg-primary-800/60 border border-primary-600 rounded-lg p-4 space-y-2"
            >
              <div class="text-white font-medium">
                {{ ticketData.payment.buyer?.fullName || "" }}
              </div>
              <div class="text-sm text-gray-400 flex items-center justify-between">
                <span>{{ ticketData.payment.buyer?.email }}</span>
                <span
                  class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200"
                  :title="ticketData.payment.buyer?.id"
                  @click="handleCopy(ticketData.payment.buyer?.id)"
                >
                  {{
                    copiedId === ticketData.payment.buyer?.id
                      ? "Скопировано!"
                      : ticketData.payment.buyer?.id
                  }}
                </span>
              </div>
            </div>
            <div v-else>
              <select
                id="buyerId"
                v-model="ticketForm.buyerId"
                class="w-full px-3 py-2 border rounded-lg bg-form-light"
                :disabled="isReadOnly"
              >
                <option value="">{{ t("ticket.noBuyer") }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.fullName }} ({{ user.email }})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useTicketApi } from "@/composables/api/useTicketApi";
import { useEventApi } from "@/composables/api/useEventApi";
import { useUserApi } from "@/composables/api/useUserApi";
import { useAttendeeApi } from "@/composables/api/useAttendeeApi";
import type { TicketAddRequest } from "@/types/ticket/TicketAddRequest";
import type { TicketUpdateRequest } from "@/types/ticket/TicketUpdateRequest";
import type { TicketResponse } from "@/types/ticket/TicketResponse";
import type { EventResponse } from "@/types/event/EventResponse";
import type { UserResponse } from "@/types/user/UserResponse";
import type { AttendeeResponse } from "@/types/attendee/AttendeeResponse";
import BaseEditor from "@/components/editors/BaseEditor.vue";
import EntityInfo from "@/components/ui/EntityInfo.vue";
import { useNotification } from "@/composables/useNotification";
import { useFormValidation } from "@/composables/useFormValidation";
import { TicketStatus } from "@/types/enums/TicketStatus";
import { UserRoles } from "../../../types/enums/UserRoles";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const ticketApi = useTicketApi();
const eventApi = useEventApi();
const userApi = useUserApi();
const attendeeApi = useAttendeeApi();
const notification = useNotification();

const ticketId = computed(() => route.params.id as string);
const isEditMode = computed(() => true);
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialTicketData = ref<TicketAddRequest | TicketUpdateRequest | null>(null);
const ticketData = ref<TicketResponse | null>(null);

// Создаем форму с правильными типами данных
const ticketForm = ref<{
  eventId: string;
  attendeeId: string | null;
  buyerId: string | null;
  qrCode: string;
}>({
  eventId: "",
  attendeeId: null,
  buyerId: null,
  qrCode: "",
});

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

          ticketForm.value = {
            eventId: ticket.eventId,
            attendeeId: ticket.attendee?.id || null,
            buyerId: ticket.payment?.buyer?.id || null,
            qrCode: ticket.qrCode,
          };

          initialTicketData.value = {
            attendeeId: ticket.attendee?.id || null,
            qrCode: ticket.qrCode,
            userId: ticket.payment?.buyer?.id || null,
          };
        } else {
          notification.error(t("errors.ticketNotFound"));
          goBack();
        }
      },
      onError: () => {
        notification.error(t("errors.loadingFailed"));
        goBack();
      },
    });
  } else {
    ticketForm.value = {
      eventId: "",
      attendeeId: null,
      buyerId: null,
      qrCode: "",
    };
    initialTicketData.value = { ...ticketForm.value };
  }

  isLoading.value = false;
});

const loadSelectOptions = async () => {
  // Загружаем события
  await eventApi.searchEvents(
    {
      filter: {
        eventIds: [],
        isActive: true,
        dateFrom: null,
        dateTo: null,
        minPrice: null,
        maxPrice: null,
        title: [],
        location: [],
        tag: [],
        description: null,
      },
      sort: [],
      pagination: { page: 1, pageSize: 100 },
    },
    {
      onSuccess: (response) => {
        if (response) {
          events.value = response.items;
        }
      },
    }
  );

  // Загружаем пользователей
  await userApi.searchUsers(
    {
      filter: { userIds: [], roles: [] },
      sort: [],
      pagination: { page: 1, pageSize: 100 },
    },
    {
      onSuccess: (response) => {
        if (response) {
          users.value = response.items;
        }
      },
    }
  );

  // Загружаем посетителей
  await attendeeApi.searchAttendees(
    {
      filter: {
        attendeeIds: [],
        fullName: null,
        birthDateFrom: null,
        birthDateTo: null,
        docType: [],
        docNumber: null,
      },
      sort: [],
      pagination: { page: 1, pageSize: 100 },
    },
    {
      onSuccess: (response) => {
        if (response) {
          attendees.value = response.items;
        }
      },
    }
  );
};

const validateForm = (): boolean => {
  // Валидация не нужна для обновления, так как все поля опциональные

  console.error("валидируется форма");
  return true;
};

const goBack = () => {
  router.push("/dashboard/tickets");
};

const resetForm = () => {
  if (initialTicketData.value) {
    if (isEditMode.value) {
      ticketForm.value = {
        eventId: ticketData.value?.eventId || "",
        attendeeId: ticketData.value?.attendee?.id || null,
        buyerId: ticketData.value?.payment?.buyer?.id || null, // Changed to match new DTO
        qrCode: ticketData.value?.qrCode || "",
      };
    } else {
      ticketForm.value = {
        eventId: (initialTicketData.value as TicketAddRequest).eventId,
        attendeeId: null,
        buyerId: null,
        qrCode: "",
      };
    }
  }
  notification.info(t("common.changesDiscarded"));
};

const saveTicket = async () => {
  const updateData: TicketUpdateRequest = {
    attendeeId: ticketForm.value.attendeeId,
    qrCode: ticketData.value?.qrCode || "",
    userId: ticketForm.value.buyerId, // Changed from paymentId to userId
  };

  await ticketApi.updateTicket(ticketId.value, updateData, {
    onSuccess: () => {
      initialTicketData.value = { ...updateData };
      notification.success(t("ticket.updateSuccess"));
    },
    onError: () => {
      notification.error(t("ticket.updateFailed"));
    },
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const copiedId = ref<string>("");
const handleCopy = async (text?: string) => {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  copiedId.value = text;
  setTimeout(() => {
    copiedId.value = "";
  }, 2000);
};
</script>

<style scoped>
.bg-primary-800\/60 {
  background-color: rgba(61, 37, 102, 0.6);
}

.border-primary-600 {
  border-color: #7c56bb;
}

.text-accent {
  color: #efe2be;
}

.hover\:text-accent:hover {
  color: #efe2be;
}
</style>
