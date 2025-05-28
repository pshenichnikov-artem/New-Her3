import { default } from '../StateWrapper.vue';
<template>
  <div class="filter-wrapper">
    <label
      class="block text-base font-semibold mb-3 flex items-center transition-colors duration-200"
      :class="[titleColor]"
    >
      <div class="mr-2 flex items-center justify-center">
        <slot name="icon"></slot>
      </div>
      {{ title }}
    </label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface BaseFilterWrapperProps {
  title: string;
  titleColor?: string;
}

const props = withDefaults(defineProps<BaseFilterWrapperProps>(), {
  titleColor: "text-text-accent",
});
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
