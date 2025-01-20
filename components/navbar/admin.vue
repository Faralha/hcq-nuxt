<script setup lang="ts">
const emit = defineEmits(['update:isOpen']);
const isOpen = ref(false);

function toggleOpen() {
  isOpen.value = !isOpen.value;
  emit('update:isOpen', isOpen.value);
}
const links = [
  // {
  //   label: 'Mentor Verification',
  //   icon: 'i-heroicons-check-badge',
  //   to: '/admin/manage/mentor'
  // },
   {
    label: 'Semester Management',
    icon: 'i-heroicons-clipboard-document-check',
    to: '/admin/manage/semester'
  }, {
    label: 'Class Management',
    icon: 'i-heroicons-academic-cap',
    to: '/admin/manage/class'
  }, {
    label: 'Tuition Management',
    icon: 'i-heroicons-banknotes',
    to: '/admin/manage/tuition'
  }]
</script>

<template>
  <div class="flex flex-col">
    <!-- <p class="font-bold text-3xl mb-3">HCQ.</p> -->
     <UButton icon="i-heroicons-x-mark" variant="link" @click="toggleOpen" />
    <UVerticalNavigation :links="links" />
  </div>
</template>