<template>
  <div class="flex flex-col min-h-screen">
    <MainNavbar />
    <main class="flex-grow bg-gray-50 py-8">
      <div class="container mx-auto px-4">

      </div>
    </main>
  </div>
  <AppFooter />
</template>

<script>
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

export default {
  name: 'HomePage',
  components: {
    MainNavbar,
    AppFooter
  }
};
</script>
