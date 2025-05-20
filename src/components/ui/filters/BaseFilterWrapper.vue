<template>
    <div class="filter-wrapper">
        <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center transition-colors duration-200">
            <!-- Иконка (если передана) -->
            <slot name="icon"></slot>
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
    margin-bottom: 1rem;
}
</style>
