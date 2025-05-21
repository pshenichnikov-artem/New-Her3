<template>
  <div class="min-h-screen flex flex-col">
    <MainNavbar />
    <div class="flex-grow flex items-center justify-center bg-content py-16 px-8">
      <div class="w-full max-w-md p-8 bg-form border border-form-border rounded-lg shadow-lg">
        <div class="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h2 class="text-2xl font-bold text-text-accent mb-6">{{ t('pages.login') }}</h2>
        <form @submit.prevent="form.handleSubmit(onSubmit)">
          <ValidationInput id="email" :label="t('fields.email')" type="email" v-model="formData.email"
            validationRules="required|email" :error-messages="{
              required: t('validation.email.required'),
              email: t('validation.email.invalid')
            }" @valid="form.updateValidationState('email', $event)"
            :triggerValidation="form.validationTrigger.email" />

          <ValidationInput id="password" :label="t('fields.password')" type="password" v-model="formData.password"
            validationRules="required" :error-messages="{
              required: t('validation.password.required')
            }" @valid="form.updateValidationState('password', $event)"
            :triggerValidation="form.validationTrigger.password" />

          <div class="flex items-center justify-between mt-6">
            <button type="submit"
              class="w-full px-4 py-3 bg-primary-500 text-text font-medium text-sm rounded-md hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-form-focus focus:ring-offset-2 focus:ring-offset-form border border-primary-400 shadow-md transition-colors"
              :disabled="form.isValidating">
              {{ t('common.buttons.login') }}
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <button @click="router.push('/register')"
            class="w-full px-4 py-3 bg-form-light text-text font-medium text-sm rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-form-focus focus:ring-offset-2 focus:ring-offset-form border border-form-border shadow-md transition-colors">
            {{ t('common.buttons.goToRegister') }}
          </button>
        </div>
      </div>
    </div>

  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from "@/components/layout/AppFooter.vue";
import { notificationService } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthApi } from '@/composables/api/useAuthApi';

const { t } = useI18n();
const router = useRouter();
const authApi = useAuthApi();

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
  // Используем authApi без try-catch
  await authApi.login({
    email: formData.email,
    password: formData.password
  }, {
    showSuccessNotification: true,
    successMessage: t('common.success.loginSuccess'),
    onError: (error) => {
      console.error('Login error:', error);
      if (error.code === 401) {
        notificationService.error(t('serverErrors.auth.invalidCredentials'));
      } else {
        notificationService.error(t('auth.login.error'));
      }
    }
  });
};
</script>
