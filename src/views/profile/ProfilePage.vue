<template>
    <div class="min-h-screen flex flex-col">
        <MainNavbar />
        <div class="flex-grow bg-content py-8 px-4 md:px-8">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold text-text-accent mb-6">{{ t('profile.title') }}</h1>

                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Сайдбар с меню -->
                    <div class="md:w-1/4">
                        <div class="bg-primary-800 rounded-lg shadow p-4 border border-primary-600">
                            <nav class="space-y-1">
                                <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
                                    class="block px-4 py-3 rounded-lg transition-colors hover:bg-primary-600"
                                    :class="{ 'bg-primary-600 text-text-accent': isActive(item.path) }">
                                    <div class="flex items-center">
                                        <IconsSet :name="item.icon" class="h-5 w-5 mr-3" />
                                        <span class="text-text">{{ item.title }}</span>
                                    </div>
                                </router-link>
                            </nav>
                        </div>
                    </div>

                    <!-- Область содержимого -->
                    <div class="md:w-3/4">
                        <div class="bg-primary-800 rounded-lg shadow p-6 border border-primary-600">
                            <router-view v-slot="{ Component }">
                                <transition name="fade" mode="out-in">
                                    <component :is="Component" />
                                </transition>
                            </router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';

const { t } = useI18n();
const route = useRoute();

// Пункты меню
const menuItems = [
    { path: '/profile/info', title: t('profile.menu.info'), icon: 'user' },
    { path: '/profile/tickets', title: t('profile.menu.tickets'), icon: 'ticket' },
    { path: '/profile/calendar', title: t('profile.menu.calendar'), icon: 'calendar' }
];

// Проверяем активный пункт меню
const isActive = (path: string) => {
    return route.path.startsWith(path);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
