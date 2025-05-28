<template>
    <BaseEditor :title="isEditMode ? t('user.edit') : t('user.create')" :back-path="'/dashboard/users'"
        :is-loading="userApi.isLoading" :has-changes="hasChanges" @back="goBack" @cancel="resetForm" @save="saveUser">
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
        <div v-else-if="userForm">
            <!-- Форма пользователя -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Базовая информация -->
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="email" class="block mb-1 font-medium">{{ t('user.fields.email') }}</label>
                        <input type="email" id="email" v-model="userForm.email"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.email }" :readonly="isReadOnly">
                        <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">{{ validationErrors.email }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="username" class="block mb-1 font-medium">{{ t('user.fields.username') }}</label>
                        <input type="text" id="username" v-model="userForm.username"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.username }" :readonly="isReadOnly">
                        <p v-if="validationErrors.username" class="text-red-500 text-sm mt-1">{{
                            validationErrors.username }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="firstName" class="block mb-1 font-medium">{{ t('user.fields.firstName') }}</label>
                        <input type="text" id="firstName" v-model="userForm.firstName"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.firstName }" :readonly="isReadOnly">
                        <p v-if="validationErrors.firstName" class="text-red-500 text-sm mt-1">{{
                            validationErrors.firstName }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="lastName" class="block mb-1 font-medium">{{ t('user.fields.lastName') }}</label>
                        <input type="text" id="lastName" v-model="userForm.lastName"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.lastName }" :readonly="isReadOnly">
                        <p v-if="validationErrors.lastName" class="text-red-500 text-sm mt-1">{{
                            validationErrors.lastName }}
                        </p>
                    </div>
                </div>

                <!-- Дополнительная информация -->
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="birthDate" class="block mb-1 font-medium">{{ t('user.fields.birthDate') }}</label>
                        <input type="date" id="birthDate" v-model="userForm.birthDate"
                            class="w-full px-3 py-2 border rounded-lg" :readonly="isReadOnly">
                    </div>

                    <div class="form-group">
                        <label for="role" class="block mb-1 font-medium">{{ t('user.fields.role') }}</label>
                        <select id="role" v-model="userForm.role" class="w-full px-3 py-2 border rounded-lg"
                            :disabled="isReadOnly">
                            <option value="User">{{ t('user.roles.user') }}</option>
                            <option value="Admin">{{ t('user.roles.admin') }}</option>
                            <option value="Manager">{{ t('user.roles.manager') }}</option>
                        </select>
                    </div>

                    <div v-if="!isEditMode" class="form-group">
                        <label for="password" class="block mb-1 font-medium">{{ t('user.fields.password') }}</label>
                        <input type="password" id="password" v-model="userForm.password"
                            class="w-full px-3 py-2 border rounded-lg"
                            :class="{ 'border-red-500': validationErrors.password }" :readonly="isReadOnly">
                        <p v-if="validationErrors.password" class="text-red-500 text-sm mt-1">{{
                            validationErrors.password }}
                        </p>
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
import { useUserApi } from '@/composables/api/useUserApi';
import type { UserUpdateRequest } from '@/types/user/UserUpdateRequest';
import BaseEditor from '@/components/editors/BaseEditor.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userApi = useUserApi();

const userId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-users-edit');
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialUserData = ref<UserUpdateRequest | null>(null);
const userForm = ref<UserUpdateRequest | null>(null);
const validationErrors = reactive<Record<string, string>>({});

const hasChanges = computed(() => {
    if (!userForm.value || !initialUserData.value) return false;
    return JSON.stringify(userForm.value) !== JSON.stringify(initialUserData.value);
});

onMounted(async () => {
    if (isEditMode.value) {
        isLoading.value = true;
        isReadOnly.value = true;
        const user = await userApi.getUserById(userId.value);
        if (user) {
            initialUserData.value = {
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                birthDate: user.birthDate,
                role: user.role
            };
            userForm.value = { ...initialUserData.value };
        }
        isLoading.value = false;
    } else {
        userForm.value = {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            birthDate: null,
            role: 'User',
            password: ''
        };
        initialUserData.value = { ...userForm.value };
    }
});

const goBack = () => {
    router.push('/dashboard/users');
};

const resetForm = () => {
    if (initialUserData.value) {
        userForm.value = { ...initialUserData.value };
    }
    validationErrors = reactive<Record<string, string>>({});
};

const toggleReadOnly = () => {
    isReadOnly.value = !isReadOnly.value;
};

const validateForm = () => {
    validationErrors = reactive<Record<string, string>>({});
    let isValid = true;

    if (!userForm.value) return false;

    if (!userForm.value.email) {
        validationErrors.email = t('validation.required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.value.email)) {
        validationErrors.email = t('validation.email');
        isValid = false;
    }

    if (!userForm.value.username) {
        validationErrors.username = t('validation.required');
        isValid = false;
    }

    if (!userForm.value.firstName) {
        validationErrors.firstName = t('validation.required');
        isValid = false;
    }

    if (!userForm.value.lastName) {
        validationErrors.lastName = t('validation.required');
        isValid = false;
    }

    if (!isEditMode.value && !userForm.value.password) {
        validationErrors.password = t('validation.required');
        isValid = false;
    }

    return isValid;
};

const saveUser = async () => {
    if (!userForm.value || !validateForm()) return;

    if (isEditMode.value) {
        const success = await userApi.updateUser(userId.value, userForm.value);
        if (success) {
            initialUserData.value = { ...userForm.value };
            isReadOnly.value = true;
        }
    } else {
        // Здесь должна быть логика создания пользователя
        // await userApi.createUser(userForm.value);
        router.push('/dashboard/users');
    }
};
</script>
