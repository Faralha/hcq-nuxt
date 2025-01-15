<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/admin">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Dashboard</UButton>
      </NuxtLink>
    </div>
    
    <h1 class="text-3xl font-bold">Manage Semester</h1>
    <p class="opacity-60">Tambah Semester Ajar</p>

    <div class="mt-5">
      <div v-if="isFetching">
        <USkeleton class="h-[0.7rem] w-[100px] mb-1" />
        <USkeleton class="h-[1.5rem] w-[200px]" />
      </div>

      <UForm v-else :state="state" class="mt-5 flex items-end gap-3" @submit="addSemester">
        <UFormGroup label="Current Semester">
          <UInput v-model="state.semester" label="Semester" type="number" />
        </UFormGroup>

        <div class="mt-3">
          <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
          <UButton v-else class="px-5" type="submit">Add</UButton>
        </div>
      </UForm>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Semester {
  semester: number;
}

const config = useRuntimeConfig();
const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const state = reactive<Semester>({
  semester: 0,
});
const toast = useToast();

async function fetchSemester() {
  isFetching.value = true;
  try {
    const { data, error } = await useFetch<Semester[]>(`${config.public.apiBase}/admin/semester`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });

    state.semester = data.value?.[0]?.semester ?? 0 ;

  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
}

async function addSemester() {
  isAdding.value = true;
  try {
    const { data, error } = await useFetch<Semester>(`${config.public.apiBase}/admin/semester`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify(state),
    });

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Semester has been added',
        icon: 'i-heroicons-check-circle',
      });
      fetchSemester();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isAdding.value = false;
  }
}

onMounted(() => {
  fetchSemester();
});

</script>