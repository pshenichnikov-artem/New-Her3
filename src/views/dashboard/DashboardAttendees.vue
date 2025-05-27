<template>
    <div v-if="!route.params.id && route.name !== 'dashboard-attendees-create'">
        <AdminDataTable :title="t('dashboard.attendees.tableTitle')" :columns="columns" :items="attendeeApi.attendees"
            :loading="attendeeApi.loading.search" :total-count="attendeeApi.totalCount"
            :current-page="pagination.pageNumber" :page-size="pagination.pageSize" @update:sort="updateSort"
            @pagination-change="handlePaginationChange" @apply-filters="loadAttendees" @reset-filters="resetFilters"
            @add="openAddAttendeeModal" @edit="openEditAttendeeModal" @delete="showDeleteConfirmation">
            <template #filters>
                <TextFilter :title="t('filters.attendee.fullName')" v-model="filter.fullName" :multiple-select="false"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="user" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <TextFilter :title="t('filters.attendee.docNumber')" v-model="filter.docNumber" :multiple-select="false"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="id" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <SelectFilter :title="t('filters.attendee.docType')" v-model="filter.docType" :options="docTypeOptions"
                    :multiple-select="true" class="compact-filter">
                    <template #icon>
                        <IconsSet name="document" class="w-4 h-4 text-primary-400" />
                    </template>
                </SelectFilter>

                <DateRangeFilter :title="t('filters.attendee.birthDate')" v-model="birthDateRange"
                    @date-for-server="updateBirthDateDates" class="compact-filter">
                    <template #icon>
                        <IconsSet name="calendar" class="w-4 h-4 text-primary-400" />
                    </template>
                </DateRangeFilter>
            </template>

            <!-- Кастомная колонка для attendeeId -->
            <template #cell-id="{ item }">
                <span class="text-white cursor-pointer select-none hover:underline transition duration-200"
                    title="Скопировать attendeeId" @click="handleCopy(item.id)">
                    {{ copiedId === item.id ? 'Скопировано!' : item.id }}
                </span>
            </template>
        </AdminDataTable>

        <ConfirmModal v-if="isDeleteConfirmationVisible" :title="t('dashboard.attendees.deleteConfirmTitle')"
            :message="t('dashboard.attendees.deleteConfirmMessage')" :confirm-text="t('common.buttons.delete')"
            :cancel-text="t('common.buttons.cancel')" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <router-view v-else />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import AdminDataTable from '@/components/adminLayout/AdminDataTable.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import TextFilter from '@/components/ui/filters/TextFilter.vue';
import SelectFilter from '@/components/ui/filters/SelectFilter.vue';
import DateRangeFilter from '@/components/ui/filters/DateRangeFilter.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import { useAttendeeApi } from '@/composables/api/useAttendeeApi';
import { useCopyWithFeedback } from '@/utils/copyUtils';
import type { SortRequest } from '@/types/common/SortRequest';
import type { PaginationRequest } from '@/types/common/PaginationRequest';
import type { AttendeeFilterRequest } from '@/types/attendee/AttendeeFilterRequest';
import type { DocumentType } from '@/types/enums/DocumentType';
import type { Column } from '@/components/adminLayout/AdminDataTable.vue';

const { t } = useI18n();
const attendeeApi = useAttendeeApi();
const router = useRouter();
const route = useRoute();

const filter = reactive<AttendeeFilterRequest>({
    attendeeIds: [],
    fullName: null,
    birthDateFrom: null,
    birthDateTo: null,
    docType: [],
    docNumber: null
});

const birthDateRange = ref<[Date | null, Date | null] | null>(null);

const pagination = reactive<PaginationRequest>({
    pageNumber: 1,
    pageSize: 20
});

const sort = ref<SortRequest[]>([]);

const docTypeOptions = [
    { value: null, label: t('filters.all') },
    { value: 'passport', label: t('attendee.docType.passport') },
    { value: 'birthCertificate', label: t('attendee.docType.birthCertificate') },
    { value: 'other', label: t('attendee.docType.other') }
];

const columns: Column[] = [
    {
        key: 'id',
        label: t('attendee.id'),
        type: 'text',
        sortable: true
    },
    {
        key: 'fullName',
        label: t('attendee.fullName'),
        type: 'text',
        sortable: true
    },
    {
        key: 'birthDate',
        label: t('attendee.birthDate'),
        type: 'date',
        sortable: true
    },
    {
        key: 'documentType',
        label: t('attendee.docType'),
        type: 'text',
        sortable: true
    },
    {
        key: 'documentNumber',
        label: t('attendee.docNumber'),
        type: 'text',
        sortable: true
    }
];

const updateBirthDateDates = (dates: [string | null, string | null] | null) => {
    if (dates) {
        filter.birthDateFrom = dates[0];
        filter.birthDateTo = dates[1] || null;
    } else {
        filter.birthDateFrom = null;
        filter.birthDateTo = null;
    }
};

const loadAttendees = async () => {
    await attendeeApi.searchAttendees({
        filter,
        sort: sort.value,
        pagination
    });
};

const updateSort = (newSort: SortRequest[]) => {
    sort.value = newSort;
    loadAttendees();
};

const handlePaginationChange = (paginationData: { page: number; pageSize: number }) => {
    pagination.pageNumber = paginationData.page;
    pagination.pageSize = paginationData.pageSize;
    loadAttendees();
};

const resetFilters = () => {
    Object.assign(filter, {
        attendeeIds: [],
        fullName: null,
        birthDateFrom: null,
        birthDateTo: null,
        docType: [],
        docNumber: null
    });
    birthDateRange.value = null;
    sort.value = [];
    pagination.pageNumber = 1;
    loadAttendees();
};

const openAddAttendeeModal = () => {
    router.push('/dashboard/attendees/create');
};

const openEditAttendeeModal = (attendee: any) => {
    if (attendee && attendee.id) {
        router.push(`/dashboard/attendees/edit/${attendee.id}`);
    }
};

const isDeleteConfirmationVisible = ref(false);
const attendeeToDelete = ref<any>(null);

const showDeleteConfirmation = (attendee: any) => {
    attendeeToDelete.value = attendee;
    isDeleteConfirmationVisible.value = true;
};

const confirmDelete = async () => {
    if (attendeeToDelete.value && attendeeToDelete.value.id) {
        await attendeeApi.deleteAttendee(attendeeToDelete.value.id);
        isDeleteConfirmationVisible.value = false;
        attendeeToDelete.value = null;
        loadAttendees();
    }
};

const cancelDelete = () => {
    isDeleteConfirmationVisible.value = false;
    attendeeToDelete.value = null;
};

const { copiedId, handleCopy } = useCopyWithFeedback();

onMounted(() => {
    loadAttendees();
});
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
