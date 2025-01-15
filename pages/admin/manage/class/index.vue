<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/admin">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Dashboard</UButton>
      </NuxtLink>
    </div>
    
    <h1 class="text-3xl font-bold">Class Management</h1>

    <!-- MATA KULIAH -->
    <AdminManageClassCourse />

    <!-- KELAS -->
    <AdminManageClassKelas />


  </section>
</template>