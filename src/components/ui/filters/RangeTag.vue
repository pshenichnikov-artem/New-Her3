<template>
  <div
    class="inline-flex items-center bg-primary-700 text-text rounded-md px-1.5 py-0.5 text-xs leading-none"
  >
    {{ label }}
    <button
      @click="$emit('remove')"
      type="button"
      class="ml-1.5 w-3 h-3 flex items-center justify-center text-text-accent hover:text-primary-200 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-full w-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
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
