<script setup lang="ts">
const links = [
{
  label: 'Mentor Verification',
  icon: 'i-heroicons-check-badge',
  to: '/admin/manage/mentor'
}, {
  label: 'Semester Management',
  icon: 'i-heroicons-clipboard-document-check',
  to: '/admin/manage/semester'
}, {
  label: 'Class Management',
  icon: 'i-heroicons-academic-cap',
  to: '/admin/manage/class'
}]
</script>

<template>
  <div class="flex flex-col">
    <p class="font-bold text-3xl mb-3">HCQ.</p>
    <UVerticalNavigation :links="links" />
  </div>
</template>