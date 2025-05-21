<template>
  <div class="min-h-screen flex flex-col">
    <MainNavbar />
    <div class="flex-grow flex flex-col items-center justify-center bg-content px-8 py-16 text-text">
      <div class="w-full max-w-md text-center mb-12">
        <h1 class="text-6xl font-bold text-text-accent mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-text mb-6">{{ t('notFound.title') }}</h2>
        <p class="text-gray-400 mb-8">{{ t('notFound.message') }}</p>
        <div class="flex justify-center">
          <button @click="router.push('/')" class="px-6 py-3 bg-primary-600 text-text font-medium text-sm rounded-md hover:bg-primary-500 
            focus:outline-none transition-colors border border-primary-400 shadow-md">
            {{ t('notFound.returnHome') }}
          </button>
        </div>
      </div>
    </div>

  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import MainNavbar from '@/components/layout/MainNavbar.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
</script>
