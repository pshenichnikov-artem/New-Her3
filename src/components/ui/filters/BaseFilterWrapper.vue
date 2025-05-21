<template>
    <div class="filter-wrapper">
        <label
            class="block text-base font-semibold text-text-accent mb-3 flex items-center transition-colors duration-200">
            <!-- Иконка (если передана) - увеличенный размер -->
            <div class="mr-2 flex items-center justify-center">
                <slot name="icon"></slot>
            </div>
            {{ title }}
        </label>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped>
.filter-wrapper {
    margin-bottom: 1.5rem;
}

/* Увеличение размера иконок внутри слота */
:deep(svg) {
    width: 1.25rem;
    /* 20px */
    height: 1.25rem;
    /* 20px */
}
</style>
