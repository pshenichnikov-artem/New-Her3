<template>
    <div>
        <h2 class="text-xl font-bold mb-6 text-text-accent">{{ t('profile.info.title') }}</h2>

        <!-- Загрузка данных -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="spinner"></div>
        </div>

        <!-- Основная информация о пользователе -->
        <div v-else-if="!isEditing" class="mb-8">
            <div class="mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-primary-700 rounded-lg p-4 border border-primary-500">
                        <h3 class="text-sm text-text-muted mb-1">{{ t('fields.fullName') }}</h3>
                        <p class="text-text-accent">{{ userData?.fullName || '—' }}</p>
                    </div>

                    <div class="bg-primary-700 rounded-lg p-4 border border-primary-500">
                        <h3 class="text-sm text-text-muted mb-1">{{ t('fields.email') }}</h3>
                        <p class="text-text-accent">{{ userData?.email || '—' }}</p>
                    </div>

                    <div class="bg-primary-700 rounded-lg p-4 border border-primary-500">
                        <h3 class="text-sm text-text-muted mb-1">{{ t('fields.phone') }}</h3>
                        <p class="text-text-accent">{{ userData?.phone || '—' }}</p>
                    </div>

                    <div class="bg-primary-700 rounded-lg p-4 border border-primary-500">
                        <h3 class="text-sm text-text-muted mb-1">{{ t('fields.birthDate') }}</h3>
                        <p class="text-text-accent">{{ formatDate(userData?.birthDate) }}</p>
                    </div>
                </div>
            </div>

            <div class="flex space-x-4 mb-8">
                <button @click="startEditing"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center">
                    <IconsSet name="edit" class="h-5 w-5 mr-2" />
                    {{ t('profile.info.editProfile') }}
                </button>
            </div>

            <!-- Форма смены пароля (всегда отображается) -->
            <div class="mt-8 border-t border-primary-600 pt-6">
                <h3 class="text-lg font-bold mb-4 text-text-accent">{{ t('profile.password.title') }}</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <ValidationInput id="oldPassword" :label="t('fields.oldPassword')" type="password"
                        v-model="passwordData.oldPassword" validationRules="required|password" :error-messages="{
                            required: t('validation.password.required'),
                            password: t('validation.password.pattern'),
                        }" @valid="(valid) => passwordForm.updateValidationState('oldPassword', valid)"
                        :triggerValidation="passwordForm.validationTrigger.oldPassword" />

                    <ValidationInput id="newPassword" :label="t('fields.newPassword')" type="password"
                        v-model="passwordData.newPassword" validationRules="required|password" :error-messages="{
                            required: t('validation.password.required'),
                            password: t('validation.password.pattern'),
                        }" @valid="(valid) => passwordForm.updateValidationState('newPassword', valid)"
                        :triggerValidation="passwordForm.validationTrigger.newPassword" />

                    <ValidationInput id="confirmPassword" :label="t('fields.confirmPassword')" type="password"
                        v-model="confirmPassword" validationRules="required|match"
                        :compareWith="passwordData.newPassword" :error-messages="{
                            required: t('validation.password.confirmRequired'),
                            match: t('validation.password.mismatch'),
                        }" @valid="(valid) => passwordForm.updateValidationState('confirmPassword', valid)"
                        :triggerValidation="passwordForm.validationTrigger.confirmPassword" />
                </div>

                <div class="flex justify-end">
                    <button @click="changePassword"
                        class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center"
                        :disabled="isChangingPassword">
                        <IconsSet name="key" class="h-5 w-5 mr-2" />
                        {{ t('profile.password.change') }}
                        <span v-if="isChangingPassword" class="ml-2 animate-spin">⟳</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Форма редактирования профиля -->
        <form v-else-if="isEditing" @submit.prevent="updateProfile" class="mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ValidationInput id="fullName" :label="t('fields.fullName')" v-model="formData.fullName"
                    validationRules="required|fullName" :error-messages="{
                        required: t('validation.fullName.required'),
                        fullName: t('validation.fullName.pattern'),
                    }" @valid="(valid) => form.updateValidationState('fullName', valid)"
                    :triggerValidation="form.validationTrigger.fullName" />

                <ValidationInput id="email" :label="t('fields.email')" type="email" v-model="formData.email"
                    validationRules="required|email" :error-messages="{
                        required: t('validation.email.required'),
                        email: t('validation.email.invalid'),
                    }" @valid="(valid) => form.updateValidationState('email', valid)"
                    :triggerValidation="form.validationTrigger.email" />

                <ValidationInput id="phone" :label="t('fields.phone')" v-model="formData.phone" validationRules="phone"
                    :error-messages="{
                        phone: t('validation.phone.pattern'),
                    }" @valid="(valid) => form.updateValidationState('phone', valid)"
                    :triggerValidation="form.validationTrigger.phone" />

                <ValidationInput id="birthDate" :label="t('fields.birthDate')" type="date" v-model="formData.birthDate"
                    validationRules="required|date"
                    :error-messages="{
                        required: t('validation.required'),
                        date: t('validation.date'),
                    }"
                    @valid="(valid) => form.updateValidationState('birthDate', valid)"
                    :triggerValidation="form.validationTrigger.birthDate"
                />
            </div>

            <div class="flex space-x-4">
                <button type="submit"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center"
                    :disabled="isSubmitting">
                    <IconsSet name="save" class="h-5 w-5 mr-2" />
                    {{ t('profile.info.saveChanges') }}
                    <span v-if="isSubmitting" class="ml-2 animate-spin">⟳</span>
                </button>

                <button type="button" @click="cancelEditing"
                    class="px-4 py-2 bg-transparent hover:bg-primary-700 text-white border border-primary-500 rounded-lg">
                    {{ t('profile.info.cancel') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useUserApi } from '@/composables/api/useUserApi';
import { useAuthApi } from '@/composables/api/useAuthApi';
import { useFormValidation } from '@/composables/useFormValidation';
import { notificationService } from '@/composables/useNotification';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import type { UserUpdateRequest } from '@/types/user/UserUpdateRequest';
import type { ChangePasswordRequest } from '@/types/auth/ChangePasswordRequest';
import type { UserResponse } from '@/types/user/UserResponse';
import { formatDate } from '@/utils/formatterUtils';

const { t } = useI18n();
const authStore = useAuthStore();
const userApi = useUserApi();
const authApi = useAuthApi();

// Состояние компонента
const isEditing = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(true);
const isChangingPassword = ref(false);
const userData = ref<UserResponse | null>(null);
const confirmPassword = ref('');

// Данные формы профиля
const formData = reactive<UserUpdateRequest>({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    role: null
});

// Данные формы смены пароля
const passwordData = reactive<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
});

// Инициализация формы профиля с валидацией
const form = useFormValidation(['fullName', 'email', 'phone', 'birthDate']);

// Инициализация формы пароля с валидацией
const passwordForm = useFormValidation(['oldPassword', 'newPassword', 'confirmPassword']);

// Загрузка данных пользователя
async function loadUserData() {
    isLoading.value = true;

    const user = await userApi.getCurrentUser({
        showSuccessNotification: false,
        showErrorNotification: true,
        onSuccess: (response) => {
            userData.value = response;
        },
    });

    isLoading.value = false;
}

// Методы
function startEditing() {
    // Заполняем форму текущими данными пользователя
    if (userData.value) {
        formData.fullName = userData.value.fullName || '';
        formData.email = userData.value.email || '';
        formData.phone = userData.value.phone || '';
        formData.birthDate = userData.value.birthDate || '';
    }
    isEditing.value = true;
}

function cancelEditing() {
    isEditing.value = false;
}

async function updateProfile() {
    // Проверяем валидность формы
    form.validateForm();

    // Проверяем, все ли поля формы валидны
    const isFormValid = Object.values(form.validationState).every(state => state);

    if (!isFormValid) {
        notificationService.error(t('common.errors.formHasErrors'));
        return;
    }

    isSubmitting.value = true;

    await userApi.updateUserBySelf(formData, {
        showSuccessNotification: true,
        showErrorNotification: true,
        onSuccess: () => {
            isEditing.value = false;
            loadUserData();
            notificationService.success(t('profile.info.updateSuccess'));
        },
    });

    isSubmitting.value = false;
}

async function changePassword() {
    // Проверяем валидность формы
    passwordForm.validateForm();

    // Проверяем, все ли поля формы валидны
    const isPasswordFormValid = Object.values(passwordForm.validationState).every(state => state);

    if (!isPasswordFormValid) {
        notificationService.error(t('common.errors.formHasErrors'));
        return;
    }

    isChangingPassword.value = true;

    const success = await authApi.changePassword(passwordData, {
        showSuccessNotification: false,
        showErrorNotification: false,
        onSuccess: () => {
            notificationService.success(t('profile.password.success'));

            // Сбрасываем форму
            passwordData.oldPassword = '';
            passwordData.newPassword = '';
            confirmPassword.value = '';
        },
        onError: (error) => {
            if (error.code === 401) {
                notificationService.error(t('serverErrors.auth.invalidOldPassword'));
            } else {
                notificationService.error(t('profile.password.error'));
            }
        },
    });

    isChangingPassword.value = false;
}

// Инициализация компонента
onMounted(async () => {
    await loadUserData();
});
</script>

<style scoped>
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
