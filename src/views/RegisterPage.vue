<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div class="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('register.title') }}</h2>
        <form @submit.prevent="handleRegister">
          <ValidationInput id="fullName" :label="$t('fields.fullName')" type="text" v-model="fullName"
            validationRules="required|fullName" :error-messages="{
              required: $t('validation.fullName.required'),
              fullName: $t('validation.fullName.pattern')
            }" @valid="updateValidationState('fullName', $event)" :triggerValidation="validationTrigger.fullName" />

          <ValidationInput id="email" :label="$t('fields.email')" type="email" v-model="email"
            validationRules="required|email" :error-messages="{
              required: $t('validation.email.required'),
              email: $t('validation.email.invalid')
            }" @valid="updateValidationState('email', $event)" :triggerValidation="validationTrigger.email" />

          <ValidationInput id="phone" :label="$t('fields.phone')" type="tel" v-model="phone"
            validationRules="required|phone" :error-messages="{
              required: $t('validation.phone.required'),
              phone: $t('validation.phone.pattern')
            }" @valid="updateValidationState('phone', $event)" :triggerValidation="validationTrigger.phone" />

          <ValidationInput id="password" :label="$t('fields.password')" type="password" v-model="password"
            validationRules="required|password" :error-messages="{
              required: $t('validation.password.required'),
              password: $t('validation.password.pattern')
            }" @valid="updateValidationState('password', $event)" :triggerValidation="validationTrigger.password" />

          <ValidationInput id="confirmPassword" :label="$t('fields.confirmPassword')" type="password"
            v-model="confirmPassword" validationRules="required|match" :error-messages="{
              required: $t('validation.password.confirmRequired'),
              match: $t('validation.password.mismatch'),
            }" :compareWith="password" @valid="updateValidationState('confirmPassword', $event)"
            :triggerValidation="validationTrigger.confirmPassword" />

          <div class="flex items-center justify-between mt-6">
            <button type="submit"
              class="w-full px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ $t('register.registerButton') }}
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <button @click="$router.push('/login')"
            class="w-full px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            {{ $t('register.loginButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script>
//import authService from '@/services/api/authService';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import AppFooter from "@/components/layout/AppFooter.vue";
import { notificationService } from '@/composables/useNotification';

export default {
  name: 'RegisterPage',
  components: {
    AppFooter,
    ValidationInput,
    LanguageSwitcher
  },
  data() {
    return {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      validationState: {
        fullName: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false
      },
      validationTrigger: {
        fullName: 0,
        email: 0,
        phone: 0,
        password: 0,
        confirmPassword: 0
      }
    };
  },
  computed: {
    allFieldsValid() {
      const isValid = Object.values(this.validationState).every(state => state === true);
      console.log('All fields valid check:', isValid, this.validationState);
      return isValid;
    }
  },
  methods: {
    updateValidationState(field, isValid) {
      console.log(`Field ${field} validation changed to: ${isValid}`);
      this.validationState[field] = isValid;
    },

    validateForm() {
      console.log('Validating form...');
      // Увеличиваем счетчики для всех полей, чтобы запустить валидацию
      const fields = ['fullName', 'email', 'phone', 'password', 'confirmPassword'];

      fields.forEach(field => {
        this.validationTrigger[field] += 1;
        console.log(`Triggered validation for ${field}: ${this.validationTrigger[field]}`);
      });

      // Небольшая задержка, чтобы реактивность успела обновиться
      return new Promise(resolve => {
        setTimeout(() => {
          const isValid = this.allFieldsValid;
          console.log('Form validation completed. Result:', isValid);

          if (!isValid) {
            console.log('Invalid fields:',
              Object.entries(this.validationState)
                .filter(([_, value]) => !value)
                .map(([key]) => key)
            );

            // Ищем первое невалидное поле
            const firstInvalidField = fields.find(field => !this.validationState[field]);
            console.log('First invalid field:', firstInvalidField);

            if (firstInvalidField) {
              const element = document.getElementById(firstInvalidField);
              if (element) {
                console.log('Scrolling to invalid field:', firstInvalidField);
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
              } else {
                console.log('Element not found:', firstInvalidField);
              }
            }
          }

          resolve(isValid);
        }, 200);
      });
    },

    async handleRegister() {
      console.log('handleRegister called');

      try {
        // Проверяем валидацию перед отправкой
        console.log('Starting form validation');
        const isValid = await this.validateForm();
        console.log('Form validation result:', isValid);

        if (!isValid) {
          console.log('Form is invalid, showing errors');
          notificationService.error(this.$t('forms.hasErrors'));
          return;
        }

        console.log('Form is valid, proceeding with submission');
        // Адаптируем данные под формат RegisterRequest
        const userData = {
          fullName: this.fullName,
          email: this.email,
          phone: this.phone,
          password: this.password
        };

        console.log('User data ready for submission:', userData);
        // Раскомментируйте реальный вызов API, когда будете готовы
        /*
        const response = await authService.register(userData);
        if (response.status === 'success') {
          notificationService.success(this.$t('register.registerSuccess'));
          this.$router.push('/');
        } else if (response.error?.code === 409) {
          notificationService.error(this.$t('serverErrors.emailAlreadyExists'));
        }
        else if (response.error?.code === 500) {
          notificationService.error(response.message);
        }
        else {
          notificationService.error(this.$t('register.registerError'));
        }
        */

        // Временное сообщение об успешной регистрации для тестирования
        notificationService.success(this.$t('forms.submitSuccess'));
      } catch (error) {
        console.error('Registration error:', error);
        notificationService.error(this.$t('register.registerError'));
      }
    },
  },
  // Добавим хук жизненного цикла для дополнительной отладки
  mounted() {
    console.log('RegisterPage mounted');
  },
  updated() {
    console.log('RegisterPage updated');
  }
};
</script>
