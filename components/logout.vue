<template>
  <UButton variant="link" icon="i-heroicons-arrow-left-end-on-rectangle" @click="logout">
    {{ title }}
  </UButton>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
async function logout() {
  try {
    await useFetch(`${config.public.apiBase}/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
  } catch (error) {
    
  } finally {
    window.location.href = '/login';
  }
}

defineProps({
  title: {
    type: String,
  },
});
</script>