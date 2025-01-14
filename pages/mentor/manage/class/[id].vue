<template>
  <section class="container-verysmall py-[4rem]">
    <div>
      <NuxtLink to="/mentor/manage/class">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Kelas</UButton>
      </NuxtLink>
    </div>

    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-bold">Class {{ class_id }}</h1>
        <p class="opacity-60">Atur Kelas Ampu</p>
      </div>

      <UButton v-if="isFetching" loading>Loading</UButton>
      <UButton v-else icon="i-heroicons-arrow-path" @click="fetchClassDetails">Refresh</UButton>
    </div>

    <!-- DATA TABLE -->
    <UTable loading v-if="isFetching" :columns="columns" />
    <UTable v-else :rows="classDetails" :columns="columns">

      <template #student_grade-data="{ row }">
        <div v-if="editingRow === row.student_id">
          <UInput :modelValue="tempGrade ?? ''" @update:modelValue="tempGrade = $event" type="number" class="w-[5rem]"
            ref="inputRef" />
        </div>
        <div v-else>
          {{ row.student_grade }}
        </div>
      </template>

      <template #actions-data="{ row }">
        <div>
          <div v-if="editingRow === row.student_id">
            <UButton v-if="isAdding" loading class="ml-2" />
            <UButton v-else @click="saveGrade(row)" class="ml-2">OK</UButton>
          </div>
          <UButton v-else icon="i-heroicons-pencil-square" variant="ghost" @click="editRow(row)" />
        </div>
      </template>
    </UTable>

  </section>
</template>

<script setup lang="ts">
interface ClassDetails {
  class_id: string;
  class_jenis: string;
  class_semester: number;
  mentor_name: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone_number: string;
  student_grade: number;
}

const toast = useToast();
const class_id = useRoute().params.id;
const config = useRuntimeConfig();
const classDetails = ref<ClassDetails[]>([]);
const editingRow = ref<string | null>(null);
const tempGrade = ref<number | null>(null);

const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);

const columns = [
  { key: "student_id", label: "ID" },
  { key: "student_name", label: "Nama" },
  { key: "student_email", label: "Email" },
  { key: "student_phone_number", label: "Nomor Telepon" },
  { key: "student_grade", label: "Nilai", class: "w-[5rem]" },
  { key: "actions", class: "w-min" }
]

async function fetchClassDetails() {
  try {
    isFetching.value = true;
    const { data } = await useFetch<ClassDetails[]>(`${config.public.apiBase}/mentor/class/${class_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    if (data.value) {
      classDetails.value = data.value.map(student => ({
        ...student,
        student_grade: student.student_grade ?? 0,
      }));
    }
  } catch(error) {
    console.log(error);
  } finally {
    isFetching.value = false;
  }
}

function editRow(row: ClassDetails) {
  editingRow.value = row.student_id;
  tempGrade.value = row.student_grade;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

async function saveGrade(row: ClassDetails) {
  try {
    isAdding.value = true;
    console.log("Class ID", class_id, "Student ID", row.student_id, "Grade", tempGrade.value);
    const {data, error} = await useFetch<ClassDetails>(`${config.public.apiBase}/mentor/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({
        id_class: class_id,
        id_student: row.student_id,
        grade: tempGrade.value,
      }),
    });

    if (data) {
      if (tempGrade.value !== null) {
        row.student_grade = tempGrade.value;
      }
      editingRow.value = null;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isAdding.value = false;
    toast.add({
      title: 'Success',
      description: 'Grade has been updated',
      icon: 'i-heroicons-check-circle',
    });
  }
}

onMounted(() => {
  fetchClassDetails();
});
</script>