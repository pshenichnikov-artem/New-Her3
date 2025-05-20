<template>
    <div
        class="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-md px-2 py-1 text-sm mr-1 mb-1 border border-indigo-200">
        {{ label }}
        <button @click="$emit('remove')" type="button"
            class="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none">
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
