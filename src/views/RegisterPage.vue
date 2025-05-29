<template>
  <div class="min-h-screen flex flex-col">
    <MainNavbar />
    <div class="flex-grow flex items-center justify-center bg-content py-16 px-8">
      <div class="w-full max-w-md p-8 bg-form border border-form-border rounded-lg shadow-lg">
        <div class="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h2 class="text-2xl font-bold text-text-accent mb-6">{{ t('pages.register') }}</h2>
        <form @submit.prevent="form.handleSubmit(onSubmit)">
          <ValidationInput id="fullName" :label="t('fields.fullName')" type="text" v-model="formData.fullName"
            validationRules="required|fullName" :error-messages="{
              required: t('validation.fullName.required'),
              fullName: t('validation.fullName.pattern')
            }" @valid="form.updateValidationState('fullName', $event)"
            :triggerValidation="form.validationTrigger.fullName" />

          <ValidationInput id="email" :label="t('fields.email')" type="email" v-model="formData.email"
            validationRules="required|email" :error-messages="{
              required: t('validation.email.required'),
              email: t('validation.email.invalid')
            }" @valid="form.updateValidationState('email', $event)"
            :triggerValidation="form.validationTrigger.email" />

          <ValidationInput id="phone" :label="t('fields.phone')" type="tel" v-model="formData.phone"
            validationRules="required|phone" :error-messages="{
              required: t('validation.phone.required'),
              phone: t('validation.phone.pattern')
            }" @valid="form.updateValidationState('phone', $event)"
            :triggerValidation="form.validationTrigger.phone" />

          <ValidationInput id="password" :label="t('fields.password')" type="password" v-model="formData.password"
            validationRules="required|password" :error-messages="{
              required: t('validation.password.required'),
              password: t('validation.password.pattern')
            }" @valid="form.updateValidationState('password', $event)"
            :triggerValidation="form.validationTrigger.password" />

          <ValidationInput id="confirmPassword" :label="t('fields.confirmPassword')" type="password"
            v-model="confirmPassword" validationRules="required|match" :error-messages="{
              required: t('validation.password.confirmRequired'),
              match: t('validation.password.mismatch'),
            }" :compareWith="formData.password" @valid="form.updateValidationState('confirmPassword', $event)"
            :triggerValidation="form.validationTrigger.confirmPassword" />

          <div class="flex items-center justify-between mt-6">
            <button type="submit"
              class="w-full px-4 py-3 bg-primary-500 text-text font-medium text-sm rounded-md hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-form-focus focus:ring-offset-2 focus:ring-offset-form border border-primary-400 shadow-md transition-colors"
              :disabled="form.isValidating">
              {{ t('common.buttons.register') }}
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <button @click="router.push('/login')"
            class="w-full px-4 py-3 bg-form-light text-text font-medium text-sm rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-form-focus focus:ring-offset-2 focus:ring-offset-form border border-form-border shadow-md transition-colors">
            {{ t('common.buttons.goToLogin') }}
          </button>
        </div>
      </div>
    </div>

  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from "@/components/layout/AppFooter.vue";
import { notificationService } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { RegisterRequest } from '@/types/auth/RegisterRequest';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthApi } from '@/composables/api/useAuthApi';

const { t } = useI18n();
const router = useRouter();
const authApi = useAuthApi();

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

// Поля формы
const formData = reactive<RegisterRequest>({
  fullName: '',
  email: '',
  phone: '',
  password: ''
});

// Дополнительные поля
const confirmPassword = ref('');

// Инициализируем форму с валидацией
const form = useFormValidation(['fullName', 'email', 'phone', 'password', 'confirmPassword']);

// Обработчик отправки формы
const onSubmit = async () => {
  // Используем authApi без try-catch
  await authApi.register(formData, {
    showSuccessNotification: true,
    successMessage: t('common.success.registerSuccess'),
    onSuccess: (data) => {
      authStore.setToken(data.token)
      authStore.setRole(data.role)

      router.push('/')
    },
    onError: (error) => {
      if (error.code === 409) {
        notificationService.error(t('serverErrors.auth.emailAlreadyExists'));
      } else {
        notificationService.error(t('auth.register.error'));
      }
    }
  });
};
</script>
