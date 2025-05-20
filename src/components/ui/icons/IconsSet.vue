<template>
    <!-- Иконка поиска -->
    <svg v-if="name === 'search'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <!-- Иконка тега -->
    <svg v-else-if="name === 'tag'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>

    <!-- Иконка цены/валюты -->
    <svg v-else-if="name === 'price'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <!-- Иконка календаря -->
    <svg v-else-if="name === 'calendar'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>

    <!-- Иконка времени/часов -->
    <svg v-else-if="name === 'time'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <!-- Иконка сетки/каталога -->
    <svg v-else-if="name === 'grid'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>

    <!-- Иконка панели управления -->
    <svg v-else-if="name === 'dashboard'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>

    <!-- Иконка пользователя/профиля -->
    <svg v-else-if="name === 'user'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>

    <!-- Иконка корзины покупок -->
    <svg v-else-if="name === 'cart'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>

    <!-- Иконка входа в систему -->
    <svg v-else-if="name === 'login'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>

    <!-- Иконка выхода из системы -->
    <svg v-else-if="name === 'logout'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>

    <!-- Иконка стрелки вниз -->
    <svg v-else-if="name === 'chevron-down'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>

    <!-- Иконка стрелки влево -->
    <svg v-else-if="name === 'chevron-left'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>

    <!-- Иконка стрелки вправо -->
    <svg v-else-if="name === 'chevron-right'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>

    <!-- Иконка меню/гамбургер -->
    <svg v-else-if="name === 'menu'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>

    <!-- Иконка закрытия/крестик -->
    <svg v-else-if="name === 'close'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <!-- Иконка логотипа/эмблемы -->
    <svg v-else-if="name === 'logo'" :class="classes" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>

    <!-- Иконки для уведомлений -->
    <!-- Иконка успеха/галочка -->
    <svg v-else-if="name === 'success'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>

    <!-- Иконка ошибки/крестик -->
    <svg v-else-if="name === 'error'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <!-- Иконка информации/буква "i" в круге -->
    <svg v-else-if="name === 'info'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <!-- Иконка предупреждения/восклицательный знак в треугольнике -->
    <svg v-else-if="name === 'warning'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>

    <!-- Заглушка (молния), если иконка не найдена -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IconSetProps {
    name: string;
    size?: string;
    class?: string;
}

const props = withDefaults(defineProps<IconSetProps>(), {
    size: '24px',
    class: '',
});

// Вычисляем классы для SVG в зависимости от переданных пропсов
const classes = computed(() => {
    // Базовые классы
    const baseClasses = ['icon'];

    // Добавляем пользовательские классы, если они есть
    if (props.class) {
        return [...baseClasses, props.class].join(' ');
    }

    return baseClasses.join(' ');
});
</script>

<style scoped>
.icon {
    display: inline-block;
    vertical-align: middle;
}
</style>
