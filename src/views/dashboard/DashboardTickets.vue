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
      :show-delete-button="false"
      @update:sort="updateSort"
      @pagination-change="handlePaginationChange"
      @apply-filters="loadTickets"
      @reset-filters="resetFilters"
      @edit="openEditTicketModal"
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
          v-model="filter.attendeeIds"
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
          class="text-white cursor-pointer select-none hover:text-accent transition-colors duration-200 truncate text-sm font-medium"
          :title="item.id"
          @click="handleCopy(item.id)"
        >
          {{ copiedId === item.id ? "Скопировано!" : item.id }}
        </span>
      </template>

      <template #cell-buyerName="{ item }">
        <div v-if="item.payment?.buyer">
          <span class="text-white">{{ item.payment.buyer.fullName }}</span>
          <div
            class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200 truncate text-[11px] mt-0.5"
            :title="item.payment.buyer.id"
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
          <span class="text-white">{{ item.attendee.fullName }}</span>
          <div
            class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200 truncate text-[11px] mt-0.5"
            :title="item.attendee.id"
            @click="handleCopy(item.attendee.id)"
          >
            {{ copiedId === item.attendee.id ? "Скопировано!" : item.attendee.id }}
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
      </template>

      <template #cell-eventId="{ item }">
        <div v-if="item.event" class="flex flex-col space-y-1">
          <span class="text-white font-medium">{{ item.event.title }}</span>
          <div class="text-sm text-gray-400">{{ formatDate(item.event.startTime) }}</div>
          <div class="flex flex-col text-[11px] space-y-0.5">
            <span
              class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200 truncate"
              :title="item.event.id"
              @click="handleCopy(item.event.id)"
            >
              {{ copiedId === item.event.id ? "Скопировано!" : item.event.id }}
            </span>
            <span
              class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200 truncate"
              :title="item.eventId"
              @click="handleCopy(item.eventId)"
            >
              {{ copiedId === item.eventId ? "Скопировано!" : item.eventId }}
            </span>
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
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
            class="text-gray-500 hover:text-accent cursor-pointer transition-colors duration-200 truncate text-[11px] mt-0.5"
            :title="item.payment.id"
            @click="handleCopy(item.payment.id)"
          >
            {{ copiedId === item.payment.id ? "Скопировано!" : item.payment.id }}
          </div>
        </div>
        <div v-else class="text-gray-400">{{ t("common.noData") }}</div>
      </template>
    </AdminDataTable>
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
  attendeeIds: [], // Изменено с attendeeId на attendeeIds
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
    width: "w-48", // Увеличили для ID билета
  },
  {
    key: "eventId",
    label: t("ticket.eventId"),
    type: "text",
    sortable: true,
    width: "w-48", // Увеличили для данных о событии
  },
  {
    key: "buyerName",
    label: t("ticket.buyerName"),
    type: "text",
    sortable: true,
    width: "w-40", // Уменьшили для покупателя
  },
  {
    key: "attendee",
    label: t("ticket.attendeeName"),
    type: "text",
    sortable: true,
    width: "w-40", // Уменьшили для посетителя
  },
  {
    key: "payment",
    label: t("ticket.payment"),
    type: "text",
    sortable: true,
    width: "w-40", // Уменьшили для оплаты
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
    attendeeIds: [], // Изменено с attendeeId на attendeeIds
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

onMounted(() => {
  loadTickets();
});

const { copiedId, handleCopy } = useCopyWithFeedback();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
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
