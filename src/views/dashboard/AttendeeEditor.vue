<template>
    <div class="bg-content rounded-xl shadow-md border border-primary-700 p-6 h-full">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-text-accent">
                {{ isEditMode ? t('attendee.edit') : t('attendee.create') }}
            </h2>
            <button @click="goBack"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
                {{ t('common.buttons.back') }}
            </button>
        </div>

        <div class="text-center text-lg text-gray-500 py-12">
            {{ isEditMode ? t('attendee.editorPlaceholder', { id: attendeeId }) : t('attendee.createPlaceholder') }}
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

const attendeeId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-attendees-edit');

const goBack = () => {
    router.push('/dashboard/attendees');
};
</script>

<style scoped>
/* Стили для редактора участников */
</style>
