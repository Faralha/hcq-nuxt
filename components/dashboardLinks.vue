<template>
  <NuxtLink :to="linkTo">
    <div class="overflow-hidden flex h-[5rem] items-start gap-2 p-4 outline outline-accent outline-1 rounded-md">
      <UIcon :name="icon" class="w-5 h-5 mt-1" />
      <div>
        <h2 class="text-l font-semibold">{{ title }}</h2>
        <p class="text-sm opacity-60">{{ description }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  linkTo: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'i-heroicons-users'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>