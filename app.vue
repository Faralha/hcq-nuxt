<template>
  <div class="flex flex-row h-screen w-screen">

    <!-- NAVBAR -->
    <div class="">
      <div v-if="isAdminRoute" class="h-screen py-5 px-3 bg-gray-800">
        <div class="" v-if="isOpen">
          <UButton icon="i-heroicons-bars-3" variant="link" @click="toggleOpen" />
        </div>
        <NavbarAdmin v-else class="text-white" @update:is-open="handleIsOpen" />
      </div>
    </div>

    <!-- CONTENT -->
    <div class="flex flex-col w-full overflow-y-auto">
      <NuxtPage class="w-full pl-2" />
      <NuxtRouteAnnouncer />
      <UProgress v-if="isLoading" animation="carousel" class="fixed bottom-0" />
    </div>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const isLoading = ref<boolean>(false);
const isOpen = ref<boolean>(false);

const isAdminRoute = computed(() => {
  const path = route.path;
  return path.startsWith('/admin') && path !== '/admin/login' && path !== '/admin/register';
});

function handleIsOpen(value: boolean) {
  isOpen.value = value;
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

const nuxtApp = useNuxtApp();
onMounted(() => {
  nuxtApp.hook('page:start', () => {
    isLoading.value = true;
  });

  nuxtApp.hook('page:finish', () => {
    isLoading.value = false;
  });
});

</script>