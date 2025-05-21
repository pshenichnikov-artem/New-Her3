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

    <!-- Иконка стрелки вправо - обновленная версия для кнопки "Подробнее" -->
    <svg v-else-if="name === 'arrowRight'" xmlns="http://www.w3.org/2000/svg" :class="classes" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M14 5l7 7-7 7"></path>
    </svg>

    <!-- Иконка часов/длительности - новая стильная версия -->
    <svg v-else-if="name === 'clock'" xmlns="http://www.w3.org/2000/svg" :class="classes" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
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

    <!-- Иконка Telegram -->
    <svg v-else-if="name === 'telegram'" xmlns="http://www.w3.org/2000/svg" :class="classes" viewBox="0 0 24 24"
        fill="currentColor">
        <path
            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.131c-.19.853-.96 4.118-1.355 5.47-.165.673-.611 2.227-1.015 2.227-.335 0-1.215-.994-1.601-1.379-.344-.344-1.861-1.217-2.302-1.492-.582-.364-1.257-.189-1.757.396-.244.286-2.242 2.189-2.645 2.606a1.39 1.39 0 01-.903.392c-.164 0-.551-.521-.551-.521s2.283-2.731 3.475-4.214c.577-.716 1.176-1.447 1.713-2.089.767-.911 1.513-1.867 2.309-2.75.599-.664 1.103-.156 1.19.435.087.591.414 3.172.465 3.681.052.499.035.969-.023 1.238z" />
    </svg>

    <!-- Иконка ВКонтакте -->
    <svg v-else-if="name === 'vk'" xmlns="http://www.w3.org/2000/svg" :class="classes" viewBox="0 0 24 24"
        fill="currentColor">
        <path
            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 16.742h-1.722c-.655 0-.856-.525-2.033-1.71-1.027-1.014-1.481-1.159-1.739-1.159-.353 0-.45.102-.45.591v1.566c0 .414-.129.712-1.192.712-1.762 0-3.71-1.073-5.088-3.074-2.065-2.927-2.635-5.131-2.635-5.583 0-.318.102-.618.61-.618h1.723c.457 0 .626.203.8.677.874 2.523 2.339 4.728 2.947 4.728.228 0 .33-.102.33-.673V9.233c-.071-1.213-.697-1.316-.697-1.747 0-.204.174-.407.448-.407h2.708c.367 0 .503.203.503.64v3.429c0 .371.166.502.268.502.228 0 .419-.13.838-.553 1.291-1.443 2.215-3.667 2.215-3.667.122-.266.258-.512.652-.512h1.723c.516 0 .632.267.516.64-.213.99-2.299 3.93-2.299 3.93-.176.295-.25.423 0 .747.175.247.748.742 1.132 1.192.675.809 1.191 1.491 1.329 1.96.153.502-.11.761-.525.761z" />
    </svg>

    <!-- Иконка домашней страницы для ссылки на основной сайт -->
    <svg v-else-if="name === 'home'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>

    <!-- Иконка фильтра -->
    <svg v-else-if="name === 'filter'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>

    <!-- Иконка рубля -->
    <svg v-else-if="name === 'currencyRuble'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <!-- Иконка местоположения -->
    <svg v-else-if="name === 'location'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>

    <!-- Иконка изображения -->
    <svg v-else-if="name === 'image'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>

    <!-- Иконка корзины/удаления -->
    <svg v-else-if="name === 'trash'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>

    <!-- Иконка плюса -->
    <svg v-else-if="name === 'plus'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>

    <!-- Иконка минуса -->
    <svg v-else-if="name === 'minus'" xmlns="http://www.w3.org/2000/svg" :class="classes" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
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
