<template>
  <div class="bg-primary-800/60 border border-primary-600 rounded-lg p-4 space-y-2">
    <div class="text-white font-medium">{{ title }}</div>
    <div v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</div>
    <div
      class="text-xs text-gray-500 cursor-pointer hover:text-accent transition-colors duration-200"
      :title="id"
      @click="handleCopy(id)"
    >
      {{ copiedId === id ? "Скопировано!" : id }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  title: string;
  subtitle?: string;
  id: string;
}>();

const copiedId = ref<string>("");

const handleCopy = async (text: string) => {
  await navigator.clipboard.writeText(text);
  copiedId.value = text;
  setTimeout(() => {
    copiedId.value = "";
  }, 2000);
};
</script>
