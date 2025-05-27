<template>
    <!-- Основной контент для списка пользователей -->
    <div v-if="!route.params.id && route.name !== 'dashboard-users-create'">
        <AdminDataTable :title="t('dashboard.users.tableTitle')" :columns="columns" :items="userApi.users"
            :loading="userApi.loading.search" :total-count="userApi.totalCount" :current-page="pagination.pageNumber"
            :page-size="pagination.pageSize" @update:sort="updateSort" @pagination-change="handlePaginationChange"
            @apply-filters="loadUsers" @reset-filters="resetFilters" @add="openAddUserModal" @edit="openEditUserModal"
            @delete="showDeleteConfirmation">
            <!-- Секция фильтров - компактная версия -->
            <template #filters>
                <TextFilter :title="t('filters.user.fullName')" v-model="filter.fullName" :multiple-select="false"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="user" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <TextFilter :title="t('filters.user.email')" v-model="filter.email" :multiple-select="false"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="email" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <TextFilter :title="t('filters.user.phone')" v-model="filter.phone" :multiple-select="false"
                    class="compact-filter">
                    <template #icon>
                        <IconsSet name="phone" class="w-4 h-4 text-primary-400" />
                    </template>
                </TextFilter>

                <SelectFilter :title="t('filters.user.role')" v-model="filter.role" :options="roleOptions"
                    :multiple-select="false" class="compact-filter">
                    <template #icon>
                        <IconsSet name="shield" class="w-4 h-4 text-primary-400" />
                    </template>
                </SelectFilter>

                <DateRangeFilter :title="t('filters.user.createdAt')" v-model="createdAtRange"
                    @date-for-server="updateCreatedAtDates" class="compact-filter">
                    <template #icon>
                        <IconsSet name="calendar" class="w-4 h-4 text-primary-400" />
                    </template>
                </DateRangeFilter>

                <DateRangeFilter :title="t('filters.user.birthDate')" v-model="birthDateRange"
                    @date-for-server="updateBirthDateDates" class="compact-filter">
                    <template #icon>
                        <IconsSet name="calendar" class="w-4 h-4 text-primary-400" />
                    </template>
                </DateRangeFilter>
            </template>

            <!-- Кастомная колонка для userId -->
            <template #cell-id="{ item }">
                <span class="text-white cursor-pointer select-none hover:underline transition duration-200"
                    title="Скопировать userId" @click="handleCopy(item.id)">
                    {{ copiedId === item.id ? 'Скопировано!' : item.id }}
                </span>
            </template>
        </AdminDataTable>

        <!-- Модальное окно подтверждения удаления -->
        <ConfirmModal v-if="isDeleteConfirmationVisible" :title="t('dashboard.users.deleteConfirmTitle')"
            :message="t('dashboard.users.deleteConfirmMessage')" :confirm-text="t('common.buttons.delete')"
            :cancel-text="t('common.buttons.cancel')" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <!-- Рендеринг дочерних маршрутов (create/edit) -->
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
import { useUserApi } from '@/composables/api/useUserApi';
import { useCopyWithFeedback } from '@/utils/copyUtils';
import type { SortRequest } from '@/types/common/SortRequest';
import type { PaginationRequest } from '@/types/common/PaginationRequest';
import type { UserFilterRequest } from '@/types/user/UserFilterRequest';
import type { UserRoles } from '@/types/enums/UserRoles';
import type { Column } from '@/components/adminLayout/AdminDataTable.vue';

const { t } = useI18n();
const userApi = useUserApi();
const router = useRouter();
const route = useRoute();

// Состояние компонента - приведено в соответствие с интерфейсом UserFilterRequest
const filter = reactive<UserFilterRequest>({
    userIds: [],
    fullName: null,
    email: null,
    phone: null,
    role: null,
    birthDateFrom: null,
    birthDateTo: '', // Необходимо предоставить начальное значение для строки
    createdAtFrom: null,
    createdAtTo: '' // Необходимо предоставить начальное значение для строки
});

// Диапазоны дат
const birthDateRange = ref<[Date | null, Date | null] | null>(null);
const createdAtRange = ref<[Date | null, Date | null] | null>(null);

const pagination = reactive<PaginationRequest>({
    pageNumber: 1,
    pageSize: 20
});

const sort = ref<SortRequest[]>([]);

// Опции для фильтра ролей
const roleOptions = [
    { value: null, label: t('filters.all') },
    { value: 'admin', label: t('user.roles.admin') },
    { value: 'user', label: t('user.roles.user') }
];

// Определение колонок таблицы
const columns: Column[] = [
    {
        key: 'id',
        label: t('user.id'),
        type: 'text',
        sortable: true
    },
    {
        key: 'fullName',
        label: t('user.fullName'),
        type: 'text',
        sortable: true
    },
    {
        key: 'email',
        label: t('user.email'),
        type: 'text',
        sortable: true
    },
    {
        key: 'phone',
        label: t('user.phone'),
        type: 'text',
        sortable: true
    },
    {
        key: 'role',
        label: t('user.role'),
        type: 'status',
        statusContext: 'role',
        sortable: true,
        align: 'center',
        width: 'w-32'
    }
];

// Методы для обновления дат
const updateBirthDateDates = (dates: [string | null, string | null] | null) => {
    if (dates) {
        filter.birthDateFrom = dates[0];
        filter.birthDateTo = dates[1] || '';
    } else {
        filter.birthDateFrom = null;
        filter.birthDateTo = '';
    }
};

const updateCreatedAtDates = (dates: [string | null, string | null] | null) => {
    if (dates) {
        filter.createdAtFrom = dates[0];
        filter.createdAtTo = dates[1] || '';
    } else {
        filter.createdAtFrom = null;
        filter.createdAtTo = '';
    }
};

// Методы
const loadUsers = async () => {
    await userApi.searchUsers({
        filter,
        sort: sort.value,
        pagination
    });
};

const updateSort = (newSort: SortRequest[]) => {
    sort.value = newSort;
    loadUsers();
};

const handlePaginationChange = (paginationData: { page: number; pageSize: number }) => {
    pagination.pageNumber = paginationData.page;
    pagination.pageSize = paginationData.pageSize;
    loadUsers();
};

const resetFilters = () => {
    // Сбрасываем фильтры к начальным значениям
    Object.assign(filter, {
        userIds: [],
        fullName: null,
        email: null,
        phone: null,
        role: null,
        birthDateFrom: null,
        birthDateTo: '',
        createdAtFrom: null,
        createdAtTo: ''
    });

    // Сбрасываем диапазоны дат
    birthDateRange.value = null;
    createdAtRange.value = null;

    // Сбрасываем сортировку
    sort.value = [];
    pagination.pageNumber = 1;
    loadUsers();
};

const openAddUserModal = () => {
    router.push('/dashboard/users/create');
};

const openEditUserModal = (user: any) => {
    if (user && user.id) {
        router.push(`/dashboard/users/edit/${user.id}`);
    }
};

const isDeleteConfirmationVisible = ref(false);
const userToDelete = ref<any>(null);

const showDeleteConfirmation = (user: any) => {
    userToDelete.value = user;
    isDeleteConfirmationVisible.value = true;
};

const confirmDelete = async () => {
    if (userToDelete.value && userToDelete.value.id) {
        await userApi.deleteUser(userToDelete.value.id);
        isDeleteConfirmationVisible.value = false;
        userToDelete.value = null;
        loadUsers();
    }
};

const cancelDelete = () => {
    isDeleteConfirmationVisible.value = false;
    userToDelete.value = null;
};

const { copiedId, handleCopy } = useCopyWithFeedback();

// Загрузка данных при монтировании компонента
onMounted(() => {
    loadUsers();
});
</script>

<style scoped>
/* Компактные стили для фильтров */
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
