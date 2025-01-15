<script setup lang="ts">
const emit = defineEmits(['update:isOpen']);
const isOpen = ref(false);

function toggleOpen() {
  isOpen.value = !isOpen.value;
  emit('update:isOpen', isOpen.value);
}
const links = [
  {
    label: 'Grade',
    icon: 'i-heroicons-academic-cap',
    to: '/student/grade'
  },
  {
    label: 'Tuition',
    icon: 'i-heroicons-banknotes',
    to: '/student/tuition'
  }
]
</script>

<template>
  <div class="flex flex-col">
    <!-- <p class="font-bold text-3xl mb-3">HCQ.</p> -->
    <UButton icon="i-heroicons-x-mark" variant="link" @click="toggleOpen" />
    <UVerticalNavigation :links="links" />
  </div>
</template>