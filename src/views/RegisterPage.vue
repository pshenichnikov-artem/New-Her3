<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div class="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ t('pages.register') }}</h2>
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
              class="w-full px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="form.isValidating">
              {{ t('common.buttons.register') }}
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <button @click="router.push('/login')"
            class="w-full px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
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
// import authService from '@/services/api/authService';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import AppFooter from "@/components/layout/AppFooter.vue";
import { notificationService } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { RegisterRequest } from '@/types/auth/RegisterRequest';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

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
  // Здесь код для отправки данных в API
  console.log('Form data ready for submission:', formData);

  // Временное сообщение об успешной регистрации для тестирования
  notificationService.success(t('common.success.registerSuccess'));

  // Реальный пример вызова API:
  /*
  const response = await authService.register(formData);
  if (response.status === 'success') {
    notificationService.success(t('common.success.registerSuccess'));
    router.push('/');
  }
  */
};
</script>
