<template>
  <section class="container-verysmall py-[5rem]">
    <h1 class="text-3xl font-bold">Manage Mentor</h1>
    <p class="opacity-60">Verifikasi Mentor</p>

    <div class="mt-5">
      <UTable v-if="isFetching" loading :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
    :progress="{ color: 'primary', animation: 'carousel' }" :columns="columns" />
      <UTable v-else :rows="transformedMentors" v-model="selected" :columns="columns" @select="select" />
    </div>

    <UForm :state="state" class="mt-5" @submit="addMentor">
      <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
      <UButton v-else class="px-5" type="submit">Add</UButton>
    </UForm>
  </section>
</template>

<script setup lang="ts">

interface Mentor {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
}

const config = useRuntimeConfig();
const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const mentors = ref<Mentor[]>([]);
const selected = ref<Mentor[]>([]);
const toast = useToast();

const state = reactive({
  id: 0,
  is_verified: false,
});

const columns = [
  {
    key: "select",
  },
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nama Lengkap",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone_number",
    label: "Phone Number",
  },
  {
    key: "is_verified",
    label: "Status",
  },
];

const transformedMentors = computed(() => {
  return mentors.value.map(mentor => ({
    ...mentor,
    is_verified: mentor.is_verified ? '✔️' : '❌', // Change true/false to icons
  }));
});

function select(row: any) {
  if (row.is_verified == '✔️') {
    toast.add({
      title: "Error",
      description: "Cannot select a verified mentor",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 3000,
    });
    return;
  }
  
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

async function fetchMentors() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<Mentor[]>(`${config.public.apiBase}/mentors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      server: false,
    });

    mentors.value = data.value || [];
  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
}

async function addMentor() {
  try {
    isAdding.value = true;
    const { data, error } = await useFetch<Mentor[]>(`${config.public.apiBase}/admin/mentor/verify`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.log(error);
  } finally {
    isAdding.value = false;
    fetchMentors();
    toast.add({
      title: "Success",
      description: "Mentor has been verified",
      icon: "i-heroicons-check-circle",
    });
  }
}

onMounted(() => {
  fetchMentors();
});
</script>
