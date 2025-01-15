<template>
  <section class="container-verysmall py-[5rem]">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p class="opacity-60">Kamu adalah Murid</p>

    <div class="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 w-full">
      <DashboardLinks title="Grade" description="Lihat Nilai" link-to="/student/grade"
        icon="i-heroicons-academic-cap" />
      <DashboardLinks title="Tuition" description="Lihat Tagihan" link-to="/student/tuition"
        icon="i-heroicons-banknotes" />
    </div>
  </section>
</template>