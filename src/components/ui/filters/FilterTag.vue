<template>
    <div
        class="inline-flex items-center bg-primary-700 text-text rounded-md px-1 py-0 text-sm mr-1 mb-1 border border-primary-600">
        {{ label }}
        <button @click="$emit('remove')" type="button"
            class="ml-1 text-text-accent hover:text-primary-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();

defineEmits<{
    remove: [];
}>();
</script>
