<template>
    <BaseEditor :title="isEditMode ? t('user.edit') : t('user.create')" :back-path="'/dashboard/users'"
        :is-loading="userApi.isLoading" :has-changes="hasChanges" @back="goBack" @cancel="resetForm"
        @save="form.handleSubmit(saveUser)">

        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin text-4xl text-primary-600">
                <i class="fas fa-spinner"></i>
            </div>
        </div>
        <div v-else-if="userForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Основная информация -->
                <div class="space-y-4">
                    <ValidationInput id="email" v-model="userForm.email" type="email" :label="t('user.fields.email')"
                        validation-rules="required|email" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required'),
                            email: t('validation.email.invalid')
                        }" :trigger-validation="form.validationTrigger.email"
                        @valid="form.updateValidationState('email', $event)" />

                    <ValidationInput id="fullName" v-model="userForm.fullName" :label="t('user.fields.fullName')"
                        validation-rules="required|fullName" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required'),
                            fullName: t('validation.fullName.pattern')
                        }" :trigger-validation="form.validationTrigger.fullName"
                        @valid="form.updateValidationState('fullName', $event)" />

                    <ValidationInput id="phone" v-model="userForm.phone" :label="t('user.fields.phone')"
                        validation-rules="required|phone" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required'),
                            phone: t('validation.phone.pattern')
                        }" :trigger-validation="form.validationTrigger.phone"
                        @valid="form.updateValidationState('phone', $event)" />
                </div>

                <!-- Дополнительная информация -->
                <div class="space-y-4">
                    <div class="form-group">
                        <label for="role" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('user.fields.role') }}
                        </label>
                        <select id="role" v-model="userForm.role"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light" :disabled="isReadOnly">
                            <option value="User">{{ t('user.roles.user') }}</option>
                            <option value="Admin">{{ t('user.roles.admin') }}</option>
                            <option value="Manager">{{ t('user.roles.manager') }}</option>
                        </select>
                    </div>

                    <ValidationInput v-if="!isEditMode" id="password" v-model="userForm.password" type="password"
                        :label="t('user.fields.password')" validation-rules="required|password" :readonly="isReadOnly"
                        :error-messages="{
                            required: t('validation.required'),
                            password: t('validation.password.pattern')
                        }" :trigger-validation="form.validationTrigger.password"
                        @valid="form.updateValidationState('password', $event)" />
                </div>
            </div>
        </div>
    </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useUserApi } from '@/composables/api/useUserApi';
import { useAuthApi } from '@/composables/api/useAuthApi';
import type { UserUpdateRequest } from '@/types/user/UserUpdateRequest';
import type { RegisterRequest } from '@/types/auth/RegisterRequest';
import BaseEditor from '@/components/editors/BaseEditor.vue';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import { UserRoles } from '@/types/enums/UserRoles';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userApi = useUserApi();
const authApi = useAuthApi();
const notification = useNotification();

const userId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-users-edit');
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialUserData = ref<UserUpdateRequest | RegisterRequest | null>(null);

// Создаем форму с правильными типами данных
const userForm = ref<UserUpdateRequest & { password: string }>({
    email: '',
    fullName: '',
    phone: '',
    role: UserRoles.User,
    password: ''
});

// Настраиваем валидацию формы - передаем все возможные поля
const form = useFormValidation(['email', 'fullName', 'phone', 'password']);

const hasChanges = computed(() => {
    if (!userForm.value || !initialUserData.value) return false;
    return JSON.stringify(userForm.value) !== JSON.stringify(initialUserData.value);
});

onMounted(async () => {
    isLoading.value = true;

    if (isEditMode.value) {
        await userApi.getUserById(userId.value, {
            onSuccess: (user) => {
                if (user) {
                    initialUserData.value = {
                        email: user.email,
                        fullName: user.fullName,
                        phone: user.phone,
                        role: user.role
                    };
                    userForm.value = {
                        ...initialUserData.value,
                        password: '' // Всегда инициализируем password как пустую строку
                    };
                } else {
                    notification.error(t('errors.userNotFound'));
                    goBack();
                }
            },
            onError: () => {
                notification.error(t('errors.loadingFailed'));
                goBack();
            }
        });
    } else {
        userForm.value = {
            email: '',
            fullName: '',
            phone: '',
            role: UserRoles.User,
            password: ''
        };
        initialUserData.value = {
            email: '',
            fullName: '',
            phone: '',
            role: UserRoles.User,
            password: ''
        };
    }

    isLoading.value = false;
});

const goBack = () => {
    router.push('/dashboard/users');
};

const resetForm = () => {
    if (initialUserData.value) {
        userForm.value = {
            ...(initialUserData.value as typeof userForm.value),
            password: '' // Всегда сбрасываем password в пустую строку
        };
    }
    form.resetValidation();
    notification.info(t('common.changesDiscarded'));
};

const saveUser = async () => {
    // Проверяем только нужные поля в зависимости от режима
    const fieldsToValidate = isEditMode.value
        ? ['email', 'fullName', 'phone']
        : ['email', 'fullName', 'phone', 'password'];

    // Проверяем валидность только необходимых полей
    const isFormValid = fieldsToValidate.every(field => form.validationState[field]);

    if (!isFormValid) {
        // Принудительно запускаем валидацию для всех полей
        fieldsToValidate.forEach(field => {
            if (form.validationTrigger[field] !== undefined) {
                form.validationTrigger[field] += 1;
            }
        });
        return;
    }

    if (isEditMode.value) {
        const updateData: UserUpdateRequest = {
            email: userForm.value.email,
            fullName: userForm.value.fullName,
            phone: userForm.value.phone,
            role: userForm.value.role
        };

        await userApi.updateUser(userId.value, updateData, {
            onSuccess: () => {
                initialUserData.value = { ...updateData };
                notification.success(t('user.updateSuccess'));
            },
            onError: () => {
                notification.error(t('user.updateFailed'));
            }
        });
    } else {
        const registerData: RegisterRequest = {
            email: userForm.value.email,
            fullName: userForm.value.fullName,
            phone: userForm.value.phone,
            password: userForm.value.password!
        };

        await authApi.register(registerData, {
            onSuccess: () => {
                notification.success(t('user.createSuccess'));
                router.push('/dashboard/users');
            },
            onError: () => {
                notification.error(t('user.createFailed'));
            }
        });
    }
};
</script>
