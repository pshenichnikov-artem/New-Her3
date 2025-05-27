<template>
    <div class="bg-content rounded-xl shadow-md border border-primary-700 p-6 h-full">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-text-accent">
                {{ isEditMode ? t('event.edit') : t('event.create') }}
            </h2>
            <button @click="goBack"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
                {{ t('common.buttons.back') }}
            </button>
        </div>

        <div class="text-center text-lg text-gray-500 py-12">
            {{ isEditMode ? t('event.editorPlaceholder', { id: eventId }) : t('event.createPlaceholder') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const eventId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-events-edit');

const goBack = () => {
    router.push('/dashboard/events');
};
</script>

<style scoped>
/* Стили для редактора событий */
</style>
