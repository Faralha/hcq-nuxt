<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/mentor">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Dashboard</UButton>
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold">Class Management</h1>
    <p class="opacity-60">Atur Kelas Ampu</p>

    <!-- TABLE DATA -->
    <UTable loading v-if="isFetching" :columns="columns" />
    <UTable v-else :rows="kelas" :columns="columns">
      <template #actions-data="{ row }">
        <div>
          <NuxtLink :to="`/mentor/manage/class/${row.class_id}`">
            <UButton icon="i-heroicons-arrow-top-right-on-square" variant="outline">
              Details
            </UButton>
          </NuxtLink>
        </div>
      </template>
    </UTable>
  </section>
</template>

<script setup lang="ts">
interface Kelas {
  class_id: string;
  class_jenis: string;
  semester: number;
  mentor_name: string;
}

const config = useRuntimeConfig();
const toast = useToast();
const kelas = ref<Kelas[]>([]);

const isFetching = ref<boolean>(false);

const columns = [
  { key: "class_id", label: "ID" },
  { key: "class_jenis", label: "Kelas" },
  { key: "semester", label: "Semester" },
  { key: "actions", label: "Actions", class: "w-[5rem]" }
]

async function fetchKelas() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<Kelas[]>(`${config.public.apiBase}/mentor/class`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      server: false
    });
    console.log(data, error);
    kelas.value = data.value || [];
  } catch (error) {
    console.log(error);
  } finally {
    isFetching.value = false;
  }
}

onMounted(() => {
  fetchKelas();
});
</script>