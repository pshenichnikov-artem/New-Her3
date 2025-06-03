<template>
    <div class="min-h-screen flex bg-content overflow-hidden">
        <!-- Боковое меню с границей справа -->
        <div class="w-64 bg-primary-700 text-white shadow-lg flex flex-col h-screen border-r border-primary-500">
            <!-- Заголовок -->
            <div class="p-4 border-b border-primary-600 flex items-center">
                <h2 class="text-xl font-bold text-text-accent">{{ t('dashboard.title') }}</h2>
            </div>

            <!-- Основные навигационные элементы -->
            <nav class="px-2 py-4 flex-grow overflow-y-auto">
                <ul class="space-y-1">
                    <li v-for="item in menuItems" :key="item.route">
                        <router-link :to="`/dashboard/${item.route}`"
                            class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200 font-medium group"
                            :class="[
                                isActive(item.route)
                                    ? 'bg-primary-600 text-white shadow-[0_2px_8px_0_rgba(124,86,187,0.15)] ring-2 ring-primary-500'
                                    : 'text-gray-300 hover:bg-primary-600 hover:text-white'
                            ]">
                            <IconsSet :name="item.icon" class="w-5 h-5 mr-3"
                                :class="isActive(item.route) ? 'text-accent' : 'text-gray-400 group-hover:text-white'" />
                            <span>{{ item.label }}</span>

                        </router-link>
                    </li>
                </ul>
            </nav>

            <!-- Переключатель языка -->
            <div class="px-4 py-3 border-t border-primary-600 border-b">
                <div class="flex items-center mb-2 text-sm text-gray-300">
                    <IconsSet name="language" class="w-4 h-4 mr-2" />
                    {{ t('common.language') }}
                </div>
                <LanguageSwitcher />
            </div>

            <!-- Нижняя панель с кнопками -->
            <div class="p-4">
                <div class="flex flex-col space-y-2">
                    <button @click="router.push('/')"
                        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-primary-600 hover:text-white">
                        <IconsSet name="home" class="w-5 h-5 mr-3" />
                        {{ t('dashboard.menu.home') }}
                    </button>
                    <button @click="logout"
                        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-notification-error hover:text-white">
                        <IconsSet name="logout" class="w-5 h-5 mr-3" />
                        {{ t('dashboard.menu.logout') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Основное содержимое - адаптировано для прямого вставления компонентов -->
        <div class="flex-1 overflow-hidden p-4 flex flex-col">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconsSet from '@/components/ui/icons/IconsSet.vue';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import { useAuthApi } from '@/composables/api/useAuthApi';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { logout: logoutAction } = useAuthApi();

// Элементы меню
const menuItems = computed(() => [
    {
        label: t('dashboard.menu.events'),
        route: 'events',
        icon: 'calendar'
    },
    {
        label: t('dashboard.menu.users'),
        route: 'users',
        icon: 'user'
    },
    {
        label: t('dashboard.menu.tickets'),
        route: 'tickets',
        icon: 'ticket'
    },
    {
        label: t('dashboard.menu.attendees'),
        route: 'attendees',
        icon: 'attendee'
    },
    {
        label: t('dashboard.menu.pages'),
        route: 'pages',
        icon: 'pages'
    }
]);

// Проверка активного пункта меню
const isActive = (routeName: string) => {
    return route.path === `/dashboard/${routeName}` ||
        (route.path === '/dashboard' && routeName === 'events');
};

// Выход из системы
const logout = () => {
    logoutAction();
    router.push('/login');
};
</script>

<style scoped>
/* Фиксируем высоту и управляем прокруткой */
.min-h-screen {
    height: 100vh;
    overflow: hidden;
}

/* Настройка основного содержимого для его дочерних элементов */
.flex-1 {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

/* Подготавливаем контейнер для router-view */
.flex-1>* {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Подсветка активной вкладки */
.bg-primary-500 {
    background-color: #674296 !important;
}

.ring-primary-300 {
    --tw-ring-color: #9779bb;
}

.text-accent {
    color: #efe2be !important;
}

.bg-accent {
    background-color: #efe2be !important;
}
</style>
