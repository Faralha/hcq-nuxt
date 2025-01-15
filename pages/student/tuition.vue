<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Dashboard</UButton>
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold">Tuition</h1>
    <p class="opacity-60">Daftar Pembayaran SPP</p>

    <UTable :rows="formattedTuition" :columns="columns">
      <template #amount-data="{ row }">
        <span>{{ formatCurrency(row.amount) }}</span>
      </template>
      <template #paid-data="{ row }">
        <span>{{ row.paid ? 'Yes' : 'No' }}</span>
      </template>
    </UTable>
  </section>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
interface Tuition {
  tuition_id: string,
  amount: number,
  semester: number,
  paid: boolean,
  last_paid: Date,
}

const config = useRuntimeConfig();
const tuition = ref<Tuition[]>([]);
const isEmpty = ref<boolean>(false);

const columns = [
  { key: "tuition_id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "semester", label: "Semester" },
  { key: "paid", label: "Paid" },
  { key: "last_paid", label: "Last Paid" },
]

async function fetchTuition() {
  try {
    const { data, error } = await useFetch<Tuition[]>(`${config.public.apiBase}/student/tuition`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });

    if (data && data.value) {
      tuition.value = data.value.map(tuition => ({
        ...tuition,
        last_paid: new Date(tuition.last_paid),
      }));
    } else {
      isEmpty.value = true;
    }
  } catch (error) {
    console.log(error);
  }
}

const formattedTuition = computed(() => {
  return tuition.value.map(item => ({
    ...item,
    last_paid: item.last_paid ? format(new Date(item.last_paid), 'dd MMMM yyyy HH.mm') : 'N/A',
  }));
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

onMounted(() => {
  fetchTuition();
});
</script>