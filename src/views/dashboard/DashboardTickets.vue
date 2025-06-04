<template>
  <div v-if="!route.params.id && route.name !== 'dashboard-tickets-create'">
    <AdminDataTable
      :title="t('dashboard.tickets.tableTitle')"
      :columns="columns"
      :items="ticketApi.tickets"
      :loading="ticketApi.loading.search"
      :total-count="ticketApi.totalCount"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :show-add-button="false"
      @update:sort="updateSort"
      @pagination-change="handlePaginationChange"
      @apply-filters="loadTickets"
      @reset-filters="resetFilters"
      @edit="openEditTicketModal"
      @delete="showDeleteConfirmation"
    >
      <template #filters>
        <TextFilter
          :title="t('filters.ticket.buyerName')"
          v-model="filter.buyerName"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="user" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
        <TextFilter
          :title="t('filters.ticket.attendeeName')"
          v-model="filter.attendeeName"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="user" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
        <TextFilter
          :title="t('filters.ticket.eventId')"
          v-model="filter.eventIds"
          :multiple-select="true"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="calendar" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
        <TextFilter
          :title="t('filters.ticket.buyerId')"
          v-model="filter.buyerIds"
          :multiple-select="true"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="user" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
        <TextFilter
          :title="t('filters.ticket.attendeeId')"
          v-model="filter.attendeeId"
          :multiple-select="true"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="user" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
        <TextFilter
          :title="t('filters.ticket.paymentId')"
          v-model="filter.paymentIds"
          :multiple-select="true"
          class="compact-filter"
        >
          <template #icon>
            <IconsSet name="credit-card" class="w-4 h-4 text-primary-400" />
          </template>
        </TextFilter>
      </template>

      <!-- Кастомная колонка для ticketId -->
      <template #cell-id="{ item }">
        <span
          class="text-white cursor-pointer select-none hover:underline transition duration-200"
          title="Скопировать ticketId"
          @click="handleCopy(item.id)"
        >
          {{ copiedId === item.id ? "Скопировано!" : item.id }}
        </span>
      </template>

      <template #cell-buyerName="{ item }">
        <div v-if="item.payment?.buyer">
          <span class="text-white">{{ item.payment.buyer.fullName }}</span>
          <div
            class="text-gray-400 text-xs cursor-pointer select-none hover:underline mt-0.5"
            title="Скопировать ID"
            @click="handleCopy(item.payment.buyer.id)"
          >
            {{
              copiedId === item.payment.buyer.id ? "Скопировано!" : item.payment.buyer.id
            }}
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
      </template>

      <template #cell-attendee="{ item }">
        <div v-if="item.attendee">
          <span>{{ item.attendee.fullName }}</span>
          <div
            class="text-gray-400 text-xs cursor-pointer select-none hover:underline mt-0.5"
            title="Скопировать ID"
            @click="handleCopy(item.attendee.id)"
          >
            {{ copiedId === item.attendee.id ? "Скопировано!" : item.attendee.id }}
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
      </template>

      <template #cell-eventId="{ item }">
        <span
          class="text-white cursor-pointer select-none hover:underline transition duration-200"
          title="Скопировать ID"
          @click="handleCopy(item.eventId)"
        >
          {{ copiedId === item.eventId ? "Скопировано!" : item.eventId }}
        </span>
      </template>

      <template #cell-payment="{ item }">
        <div v-if="item.payment" class="flex flex-col">
          <div class="flex items-center justify-between w-full">
            <span class="text-white">{{ item.payment.amount }} ₽</span>
            <span
              :class="{
                'text-green-400': item.payment.status === 1,
                'text-yellow-400': item.payment.status === 0,
                'text-red-400': item.payment.status === 2,
              }"
            >
              {{ t(`statuses.payment.${item.payment.status}`) }}
            </span>
          </div>
          <div
            class="text-gray-400 text-xs cursor-pointer hover:underline mt-1"
            @click="handleCopy(item.payment.id)"
          >
            {{ copiedId === item.payment.id ? "Скопировано!" : item.payment.id }}
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
      </template>
    </AdminDataTable>

    <ConfirmModal
      v-if="isDeleteConfirmationVisible"
      :title="t('dashboard.tickets.deleteConfirmTitle')"
      :message="t('dashboard.tickets.deleteConfirmMessage')"
      :confirm-text="t('common.buttons.delete')"
      :cancel-text="t('common.buttons.cancel')"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import AdminDataTable from "@/components/adminLayout/AdminDataTable.vue";
import IconsSet from "@/components/ui/icons/IconsSet.vue";
import TextFilter from "@/components/ui/filters/TextFilter.vue";
import SelectFilter from "@/components/ui/filters/SelectFilter.vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import { useTicketApi } from "@/composables/api/useTicketApi";
import type { TicketFilterRequest } from "@/types/ticket/TicketFilterRequest";
import type { SortRequest } from "@/types/common/SortRequest";
import type { PaginationRequest } from "@/types/common/PaginationRequest";
import type { TicketStatus } from "@/types/enums/TicketStatus";
import type { Column } from "@/components/adminLayout/AdminDataTable.vue";
import { useCopyWithFeedback } from "@/utils/copyUtils";

const { t } = useI18n();
const ticketApi = useTicketApi();
const router = useRouter();
const route = useRoute();

const filter = reactive<TicketFilterRequest>({
  ticketIds: [],
  eventIds: [],
  buyerIds: [],
  buyerName: null,
  attendeeId: [],
  attendeeName: null,
  paymentIds: [],
});

const pagination = reactive<PaginationRequest>({
  page: 1,
  pageSize: 20,
});

// Добавляем константу для изначальной сортировки
const initialSort: SortRequest[] = [{ sortBy: "paymentdate", sortDirection: "desc" }];

// Используем её при инициализации
const sort = ref<SortRequest[]>([...initialSort]);

const statusOptions = [
  { value: null, label: t("filters.all") },
  { value: "active", label: t("ticket.status.active") },
  { value: "used", label: t("ticket.status.used") },
  { value: "cancelled", label: t("ticket.status.cancelled") },
  { value: "expired", label: t("ticket.status.expired") },
];

// Определение колонок таблицы
const columns: Column[] = [
  {
    key: "id",
    label: t("ticket.id"),
    type: "text",
    sortable: true,
    width: "w-32",
  },
  {
    key: "eventId",
    label: t("ticket.eventId"),
    type: "text",
    sortable: true,
    width: "w-32",
  },
  {
    key: "buyerName",
    label: t("ticket.buyerName"),
    type: "text",
    sortable: true,
    width: "w-32",
  },
  {
    key: "attendee",
    label: t("ticket.attendeeName"),
    type: "text",
    sortable: true,
    width: "w-32",
  },
  {
    key: "payment",
    label: t("ticket.payment"),
    type: "text",
    sortable: true,
    width: "w-48",
  },
];

// При сортировке преобразуем ключи
const updateSort = (newSort: SortRequest[]) => {
  if (!newSort || newSort.length === 0) {
    // Если нет сортировки, возвращаем к дефолтной
    sort.value = [...initialSort];
  } else {
    // Иначе преобразуем ключи для бэкенда
    sort.value = newSort.map((sort) => {
      const sortByMap: Record<string, string> = {
        eventId: "eventid",
        buyerName: "buyername",
        attendee: "attendeename",
        payment: "paymentdate",
      };

      return {
        sortBy: sortByMap[sort.sortBy] || sort.sortBy,
        sortDirection: sort.sortDirection,
      };
    });
  }
  loadTickets();
};

const loadTickets = async () => {
  await ticketApi.searchTickets({
    filter,
    sort: sort.value,
    pagination,
  });
};

const handlePaginationChange = (paginationData: { page: number; pageSize: number }) => {
  pagination.page = paginationData.page;
  pagination.pageSize = paginationData.pageSize;
  loadTickets();
};

const resetFilters = () => {
  Object.assign(filter, {
    ticketIds: [],
    eventIds: [],
    buyerIds: [],
    buyerName: null,
    attendeeId: [],
    attendeeName: null,
    paymentIds: [],
  });
  // Возвращаем к изначальной сортировке через копию массива
  sort.value = [...initialSort];
  pagination.page = 1;
  loadTickets();
};

const openAddTicketModal = () => {
  router.push("/dashboard/tickets/create");
};

const openEditTicketModal = (ticket: any) => {
  router.push(`/dashboard/tickets/edit/${ticket.id}`);
};

const isDeleteConfirmationVisible = ref(false);
const ticketToDelete = ref<any>(null);

const showDeleteConfirmation = (ticket: any) => {
  ticketToDelete.value = ticket;
  isDeleteConfirmationVisible.value = true;
};

const confirmDelete = async () => {
  if (ticketToDelete.value && ticketToDelete.value.id) {
    await ticketApi.deleteTicket(ticketToDelete.value.id);
    isDeleteConfirmationVisible.value = false;
    ticketToDelete.value = null;
    loadTickets();
  }
};

const cancelDelete = () => {
  isDeleteConfirmationVisible.value = false;
  ticketToDelete.value = null;
};

onMounted(() => {
  loadTickets();
});

const { copiedId, handleCopy } = useCopyWithFeedback();
</script>

<style scoped>
:deep(.compact-filter) {
  margin-bottom: 0.25rem;
}

:deep(.compact-filter label) {
  font-size: 0.75rem;
  margin-bottom: 0.125rem;
}

:deep(.compact-filter input),
:deep(.compact-filter select) {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
}
</style>
