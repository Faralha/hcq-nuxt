<template>
  <div class="flex flex-row h-screen w-screen">
    <NavbarAdmin v-if="isAdminRoute" class="h-full p-5 bg-gray-800 text-white" />

    <div class="flex flex-col w-full">
      <NuxtPage class="w-full pl-2" />
      <NuxtRouteAnnouncer />
    </div>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const showNavbar = ref(false);

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin');
});

const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value;
};

</script>