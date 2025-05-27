<template>
    <div>
        <h1 class="text-2xl font-bold text-text-accent mb-6">{{ t('dashboard.pages.title') }}</h1>
        <div class="bg-form border border-form-border p-6 rounded-lg shadow-sm">
            <p class="text-text">{{ t('dashboard.pages.description') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
