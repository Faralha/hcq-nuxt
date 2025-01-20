<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/admin">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Dashboard</UButton>
      </NuxtLink>
    </div>
    
    <h1 class="text-3xl font-bold">Tuition Management</h1>
    <p class="opacity-60 mb-5">Atur Infaq Pendidikan Murid</p>

    <!-- DATA TABLE -->
    <div>
      <div class="flex justify-between">
        <UInput class="w-[20rem]" v-model="q" placeholder="Cari Orang..." variant="outline" />

        <UButton v-if="isFetching" loading>Loading</UButton>
        <UButton v-else icon="i-heroicons-plus-circle" @click="isOpen = true">
          Add Bills
        </UButton>
      </div>

      <!-- TUITION INSERT MODAL -->
      <UModal v-model="isOpen" @click="console.log(state)">
        <div class="p-4">
          <h2 class="text-l font-semibold">Add Bills</h2>
          <p class="text-sm opacity-60 mb-2">Tambah Tagihan</p>

          <UForm :state="state" @submit="insertTuition">
            <UFormGroup label="Student">
              <USelectMenu searchable searchable-placeholder="Select Student" :options="formattedStudents"
                v-model="state.student" />
            </UFormGroup>
            <UFormGroup label="Amount">
              <UInput type="number" v-model="state.amount" />
            </UFormGroup>
            <div class="flex flex-row items-end gap-3">
              <UFormGroup label="Semester" class="w-2/3">
                <USelectMenu :options="formattedSemesters" v-model="state.semester" />
              </UFormGroup>
              <UFormGroup class="w-1/3" label="Lunas">
                <UCheckbox help="Ceklis jika lunas" v-model="state.paid" />
              </UFormGroup>
            </div>
            <div class="mt-3">
              <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
              <UButton v-else class="px-5" type="submit">Add</UButton>
            </div>
          </UForm>
        </div>
      </UModal>

      <!-- TABLE DATA -->
      <UTable v-if="isFetching" loading :columns="columns" />
      <UTable v-else :rows="filteredTuition" :columns="columns">
        <template #amount-data="{ row }">
          <p>{{ formatCurrency(row.amount) }}</p>
        </template>
      </UTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

interface Tuition {
  id_student: string,
  amount: number,
  semester?: number,
  paid?: boolean,
  last_paid?: Date,
  student_id: string,
  student_name: string,
  student_email: string,
  student_phone_number: number,
}

interface Semester {
  semester: number;
}

const toast = useToast();
const config = useRuntimeConfig();
const tuition = ref<Tuition[]>([]);
const q = ref<string>('');
const formattedStudents = ref<{ label: string, value: string }[]>([]);
const semester = ref<Semester[]>([]);
const formattedSemesters = ref<{ label: string, value: number }[]>([]);
const isOpen = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const state = reactive({
  student: {
    label: '',
    value: '',
  },
  amount: 0,
  semester: {
    label: '',
    value: 0,
  },
  paid: false,
});

const columns = [
  { key: "student_name", label: "Nama Murid" },
  { key: "student_email", label: "Email" },
  { key: "amount", label: "Infaq", sortable: true },
  { key: "paid", label: "Status", sortable: true },
]

async function fetchTuition() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<Tuition[]>(`${config.public.apiBase}/admin/tuition`, {
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
        amount: tuition.amount ?? 0,
        semester: tuition.semester ?? 0,
        paid: Boolean(tuition.paid),
      }));

      formattedStudents.value = data.value.map(student => ({
        label: `${student.student_name} - ${student.student_email}`,
        value: student.student_id,
      }));
    }
  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
}

async function fetchSemester() {
  try {
    const { data, error } = await useFetch<Semester[]>(`${config.public.apiBase}/admin/semester`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    if (data && data.value) {
      semester.value = data.value;
      formattedSemesters.value = data.value.map(sem => ({
        label: `Semester ${sem.semester}`,
        value: sem.semester,
      }));
    }
  } catch (error) {
    console.log(error);
  }
}

async function insertTuition() {
  try {
    isAdding.value = true;
    await $fetch<Tuition>(`${config.public.apiBase}/admin/tuition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        student_id: state.student.value,
        amount: state.amount,
        semester: state.semester.value,
        paid: state.paid,
      }),
    });
  } catch (error) {
    console.log(error);
  } finally {
    resetState();
    isAdding.value = false;
    isOpen.value = false;
    fetchTuition();
    toast.add({
      title: 'Success',
      description: 'Tuition has been added',
      icon: 'i-heroicons-check-circle',
    })
  }
}


const formattedTuition = computed(() => {
  return tuition.value.map(item => ({
    ...item,
    last_paid: item.last_paid ? format(new Date(item.last_paid), 'dd MMMM yyyy HH.mm') : 'N/A',
  }));
});

const filteredTuition = computed(() => {
  return formattedTuition.value.filter(item =>
    item.student_name.toLowerCase().includes(q.value.toLowerCase())
  );
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

function resetState() {
  state.student = {
    label: '',
    value: '',
  };
  state.amount = 0;
  state.semester = {
    label: '',
    value: 0,
  };
  state.paid = false;
}

watch(() => state.student.value, (newStudent) => {
  const selectedStudent = tuition.value.find(student => student.student_id === newStudent);
  if (selectedStudent) {
    state.amount = selectedStudent.amount;
    state.paid = selectedStudent.paid ?? false;
  }
});

onMounted(() => {
  fetchTuition();
  fetchSemester();
})
</script>