<template>
  <header class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Логотип и название -->
        <div class="flex items-center">
          <router-link to="/"
            class="flex items-center text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
            <img src="https://static.tildacdn.com/tild3634-3764-4564-b734-633837646565/logo.svg" alt="Logo"
              class="h-16 w-auto max-w-[220px] mr-2 logo-image" />
          </router-link>
        </div>

        <!-- Поиск - всегда виден -->
        <div class="flex-1 mx-6 navbar-search">
          <NavbarSearch />
        </div>

        <!-- Кнопки навигации - показаны на десктопе (от 1024px и выше) -->
        <nav class="hidden lg:flex items-center space-x-1">
          <router-link to="/events"
            class="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="calendar" class="h-5 w-5 mr-1" />
            {{ t('navbar.events') }}
          </router-link>

          <!-- Добавляем ссылку на панель управления для админа -->
          <router-link v-if="isAdmin" to="/dashboard"
            class="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="dashboard" class="h-5 w-5 mr-1" />
            {{ t('navbar.dashboard') }}
          </router-link>

          <!-- Отображаем профиль только для обычного пользователя -->
          <router-link v-if="isAuthenticated && isUser" to="/profile"
            class="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="user" class="h-5 w-5 mr-1" />
            {{ t('navbar.profile') }}
          </router-link>

          <!-- Переключатель языка -->
          <div class="px-3 py-2">
            <LanguageSwitcher />
          </div>

          <button v-if="!isAuthenticated" @click="goToLogin"
            class="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow flex items-center">
            <IconsSet name="login" class="h-5 w-5 mr-1" />
            {{ t('navbar.login') }}
          </button>

          <button v-else @click="logout"
            class="ml-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center">
            <IconsSet name="logout" class="h-5 w-5 mr-1" />
            {{ t('navbar.logout') }}
          </button>
        </nav>

        <!-- Мобильные иконки (отображаются на экранах до 1024px) -->
        <div class="flex items-center lg:hidden space-x-2">
          <!-- Кнопка меню (отображается на экранах до 1024px) -->
          <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            data-menu-btn type="button" aria-label="Меню">
            <IconsSet v-if="!mobileMenuOpen" name="menu" class="h-6 w-6 text-gray-700" />
            <IconsSet v-else name="close" class="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      <!-- Мобильное меню (отображается на экранах до 1024px) -->
      <div v-if="mobileMenuOpen" class="lg:hidden pb-4 animate-fadeIn">
        <nav class="flex flex-col space-y-3 mt-2">
          <router-link to="/events" @click="mobileMenuOpen = false"
            class="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="calendar" class="h-5 w-5 mr-3" />
            {{ t('navbar.events') }}
          </router-link>

          <!-- Добавляем ссылку на панель управления для админа в мобильном меню -->
          <router-link v-if="isAdmin" to="/dashboard" @click="mobileMenuOpen = false"
            class="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="dashboard" class="h-5 w-5 mr-3" />
            {{ t('navbar.dashboard') }}
          </router-link>

          <!-- Отображаем профиль только для обычного пользователя в мобильном меню -->
          <router-link v-if="isAuthenticated && isUser" to="/profile" @click="mobileMenuOpen = false"
            class="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center font-medium"
            active-class="bg-indigo-50 text-indigo-700">
            <IconsSet name="user" class="h-5 w-5 mr-3" />
            {{ t('navbar.profile') }}
          </router-link>

          <!-- Переключатель языка в мобильном меню -->
          <div class="px-4 py-3 flex justify-start">
            <LanguageSwitcher />
          </div>

          <button v-if="!isAuthenticated" @click="goToLogin"
            class="w-full flex items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm">
            <IconsSet name="login" class="h-5 w-5 mr-3" />
            {{ t('navbar.login') }}
          </button>

          <button v-else @click="logout"
            class="w-full flex items-center px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
            <IconsSet name="logout" class="h-5 w-5 mr-3" />
            {{ t('navbar.logout') }}
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import NavbarSearch from '@/components/layout/NavbarSearch.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthApi } from '@/composables/api/useAuthApi';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const authApi = useAuthApi();

// Состояние компонента
const mobileMenuOpen = ref(false);

// Вычисляемые свойства для авторизации
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const isUser = computed(() => authStore.isUser);

// Методы навигации
const goToLogin = () => {
  router.push('/login');
  mobileMenuOpen.value = false;
};

// Выход из системы
const logout = () => {
  authApi.logout();
  mobileMenuOpen.value = false;
};

// Переключение мобильного меню
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Обработка изменения размера окна
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    mobileMenuOpen.value = false;
  }
};

// Обработка клика вне меню
const handleOutsideClick = (event: MouseEvent) => {
  const header = document.querySelector('header');
  const menuBtn = document.querySelector('[data-menu-btn]');

  // Пропускаем обработку клика по самой кнопке меню и её дочерним элементам
  if (menuBtn && (menuBtn === event.target || menuBtn.contains(event.target as Node))) {
    return;
  }

  // Закрываем меню, если клик был вне заголовка
  if (mobileMenuOpen.value && header && !header.contains(event.target as Node)) {
    mobileMenuOpen.value = false;
  }
};

// Монтирование компонента
onMounted(() => {
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleOutsideClick);
});

// Размонтирование компонента
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

/* Улучшение кликабельности кнопок на мобильных устройствах */
@media (max-width: 1023px) {

  button,
  a {
    min-height: 44px;
    /* Минимальная высота для сенсорных устройств */
    min-width: 44px;
    /* Минимальная ширина для сенсорных устройств */
  }

  /* Увеличение активной области кнопок */
  nav a,
  nav button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 8px;
  }
}

/* Стиль для логотипа на белом фоне */
.logo-image {
  filter: brightness(0.8) contrast(1.2);
  /* Делаем изображение темнее для лучшей видимости на белом фоне */
  background-color: rgba(79, 70, 229, 0.05);
  /* Добавляем очень легкий фон индиго цвета */
  padding: 8px 10px;
  /* Увеличиваем внутренние отступы для лучшей видимости */
  border-radius: 4px;
  /* Закругляем края */
  object-fit: contain;
  /* Гарантируем, что логотип сохраняет пропорции */
}
</style>
