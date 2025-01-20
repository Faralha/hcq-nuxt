<template>
  <section class="container-verysmall py-[5rem]">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <p class="opacity-60">Kamu adalah Admin</p>

    <div class="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 w-full">
      <DashboardLinks title="Manage Semester" description="Atur Semester" link-to="/admin/manage/semester"
        icon="i-heroicons-clipboard-document-check" />
      <DashboardLinks title="Manage Class" description="Atur Kelas dan Mata Kuliah" link-to="/admin/manage/class"
        icon="i-heroicons-academic-cap" />
      <DashboardLinks title="Manage Tuition" description="Atur Tagihan Murid" link-to="/admin/manage/tuition"
        icon="i-heroicons-banknotes" />
    </div>
</section>
</template>