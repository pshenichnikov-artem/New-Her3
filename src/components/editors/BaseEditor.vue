<template>
  <div class="bg-content rounded-xl shadow-md border border-primary-700 p-6 h-full">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="handleBack"
          class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors flex items-center gap-2"
        >
          <i class="fas fa-arrow-left"></i>
          <span>{{ t("common.buttons.back") }}</span>
        </button>
        <h2 class="text-2xl font-bold text-text-accent">
          <slot name="title">{{ title }}</slot>
        </h2>
      </div>
      <div class="flex gap-3">
        <slot name="actions"></slot>
        <button
          @click="handleCancel"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors"
        >
          {{ t("common.buttons.cancel") }}
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
          :disabled="isLoading || disabled"
        >
          <span v-if="isLoading" class="inline-block animate-spin mr-2">
            <i class="fas fa-spinner"></i>
          </span>
          {{ t("common.buttons.save") }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSave">
      <fieldset :disabled="isFormDisabled">
        <slot></slot>
      </fieldset>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

interface Props {
  title: string;
  isLoading?: boolean;
  isReadOnly?: boolean;
  disabled?: boolean;
  backPath: string;
  hasChanges?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isReadOnly: false,
  disabled: false,
  hasChanges: false,
});

const emit = defineEmits<{
  (e: "back"): void;
  (e: "cancel"): void;
  (e: "save"): void;
}>();

const handleBack = () => {
  emit("back");
};

const handleCancel = () => {
  emit("cancel");
};

const handleSave = () => {
  emit("save");
};

// Выносим состояние блокировки в computed
const isFormDisabled = computed(() => props.isReadOnly || props.isLoading);
</script>

<style scoped>
.bg-primary-800 {
  background-color: #3d2566 !important;
}

.border-primary-600 {
  border-color: #7c56bb !important;
}
</style>
