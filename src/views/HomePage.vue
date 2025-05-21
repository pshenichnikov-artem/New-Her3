<template>
  <div class="flex flex-col min-h-screen">
    <MainNavbar />
    <main class="flex-grow bg-content py-8 text-text">
      <div class="w-full px-8">
        <!-- Содержимое главной страницы -->
      </div>
    </main>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>
