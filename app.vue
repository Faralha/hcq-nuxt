<template>
  <div class="flex flex-row h-screen w-screen">

    <!-- NAVBAR -->
    <div class="">
      <div v-if="isAdminRoute || isMentorRoute || isStudentRoute"
        class="h-screen py-5 px-3 bg-gray-800 flex flex-col justify-between">
        <div>
          <div v-if="isAdminRoute">
            <div class="" v-if="isOpen">
              <UButton icon="i-heroicons-bars-3" variant="link" @click="toggleOpen" />
            </div>
            <NavbarAdmin v-else class="text-white min-w-[10rem]" @update:is-open="handleIsOpen" />
          </div>

          <div v-else-if="isMentorRoute">
            <div class="" v-if="isOpen">
              <UButton icon="i-heroicons-bars-3" variant="link" @click="toggleOpen" />
            </div>
            <NavbarMentor v-else class="text-white min-w-[10rem]" @update:is-open="handleIsOpen" />
          </div>

          <div v-else-if="isStudentRoute">
            <div class="" v-if="isOpen">
              <UButton icon="i-heroicons-bars-3" variant="link" @click="toggleOpen" />
            </div>
            <NavbarStudent v-else class="text-white min-w-[10rem]" @update:is-open="handleIsOpen" />
          </div>
        </div>

        <Logout v-if="isOpen" />
        <Logout v-else title="Log Out" />
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

const isMentorRoute =
  computed(() => {
    const path = route.path;
    return path.startsWith('/mentor') && path !== '/mentor/login' && path !== '/mentor/register';
  })

const isStudentRoute =
  computed(() => {
    const path = route.path;
    return path.startsWith('/student') && path !== '/login' && path !== '/register' || path === '/';
  })

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