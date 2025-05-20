<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div class="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ t('pages.login') }}</h2>
      <form @submit.prevent="form.handleSubmit(onSubmit)">
        <ValidationInput id="email" :label="t('fields.email')" type="email" v-model="formData.email"
          validationRules="required|email" :error-messages="{
            required: t('validation.email.required'),
            email: t('validation.email.invalid')
          }" @valid="form.updateValidationState('email', $event)" :triggerValidation="form.validationTrigger.email" />

        <ValidationInput id="password" :label="t('fields.password')" type="password" v-model="formData.password"
          validationRules="required" :error-messages="{
            required: t('validation.password.required')
          }" @valid="form.updateValidationState('password', $event)"
          :triggerValidation="form.validationTrigger.password" />

        <div class="flex items-center justify-between mt-6">
          <button type="submit"
            class="w-full px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="form.isValidating">
            {{ t('common.buttons.login') }}
          </button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <button @click="router.push('/register')"
          class="w-full px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          {{ t('common.buttons.goToRegister') }}
        </button>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import authService from '@/services/api/authService';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import AppFooter from "@/components/layout/AppFooter.vue";
import { notificationService } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

// Интерфейс для данных формы логина
interface LoginFormData {
  email: string;
  password: string;
}

// Поля формы
const formData = reactive<LoginFormData>({
  email: '',
  password: ''
});

// Инициализируем форму с валидацией
const form = useFormValidation(['email', 'password']);

// Обработчик отправки формы
const onSubmit = async () => {
  try {
    // Вызов API для логина
    const response = await authService.login({
      email: formData.email,
      password: formData.password
    });

    if (response.status === 'success') {
      notificationService.success(t('common.success.loginSuccess'));
      router.push('/');
    } else {
      if (response.error?.code === 401) {
        notificationService.error(t('serverErrors.auth.invalidCredentials'));
      } else if (response.error?.code === 500) {
        notificationService.error(response.message);
      } else {
        notificationService.error(t('auth.login.error'));
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    notificationService.error(t('auth.login.error'));
  }
};
</script>
