<template>
  <section class="container-verysmall py-[5rem]">
    <div>
      <NuxtLink to="/admin/manage/class">
        <UButton icon="i-heroicons-arrow-left-circle" variant="link" class="pl-0 mb-3">Kembali ke Kelas</UButton>
      </NuxtLink>
    </div>

    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-bold">Class: {{ class_id }} </h1>
        <p class="opacity-60">Pengajar: {{ mentor }}</p>
      </div>

      <div>
        <UButton color="green" icon="i-heroicons-user-plus" label="open" @click="isOpen = true">
          Add Student
        </UButton>
        <UModal v-model="isOpen" :popper="{ placement: 'bottom-end' }">
          <div class="p-4 w-full">
            <h2 class="font-semibold mb-3">Add Student</h2>

            <UForm :state="state" @submit="assignStudent">
              <UFormGroup label="Student">
                <USelectMenu searchable searchable-placeholder="Select Student" multiple :options="formattedStudents"
                  class="w-full" v-model="state.students" />
              </UFormGroup>

              <div class="mt-3">
                <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
                <UButton v-else class="px-5" type="submit">Add</UButton>
              </div>
            </UForm>
          </div>
        </UModal>
      </div>
    </div>

    <UTable loading v-if="isFetching" :columns="columns" />
    <UTable v-else :rows="classDetails.students" :columns="columns">
      <template #actions-data="{ row }">
        <UButton v-if="isDeleting[row.student_id]" loading color="red" />
        <UButton v-else color="red" icon="i-heroicons-user-minus" @click="removeStudent(row)">
          Remove
        </UButton>
      </template>
    </UTable>

  </section>
</template>

<script setup lang="ts">
interface ClassDetails {
  class_id: string;
  class_jenis: string;
  class_semester: number;
  class_teacher: string;
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone_number: string;
}

const toast = useToast();
const config = useRuntimeConfig();
const class_id = useRoute().params.id;
const classDetails = ref<ClassDetails>(
  {
    class_id: '',
    class_jenis: '',
    class_semester: 0,
    class_teacher: '',
    students: [],
  }
);
const students = ref<Student[]>([]);
const state = reactive({
  students: [] as { label: string, value: string }[],
});

const isOpen = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const isDeleting = reactive<Record<string, boolean>>({});
const isAdding = ref<boolean>(false);

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  // { key: "phone_number", label: "Nomor Telepon" },
  { key: "actions" }
]

const formattedStudents = computed(() => {
  const studentIdsInClass = new Set(classDetails.value.students.map(s => s.id));
  return students.value
    .filter(student => !studentIdsInClass.has(student.id))
    .map(student => ({
      label: `${student.name} - ${student.email}`,
      value: student.id,
    }));
});

const mentor = ref<string | null>(null);
watch(classDetails, (newVal) => {
  if (newVal.class_teacher) {
    mentor.value = newVal.class_teacher;
  }
});

async function fetchClassDetails() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<ClassDetails>(`${config.public.apiBase}/admin/class/${class_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    if (data.value) {
      classDetails.value = data.value;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isFetching.value = false;
  }
}

async function fetchStudents() {
  try {
    const { data, error } = await useFetch<Student[]>(`${config.public.apiBase}/student`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    students.value = data.value || [];
  } catch (error) {
    console.error(error);
  }
}

async function assignStudent() {
  try {
    isAdding.value = true;
    const studentIds = state.students.map(({ value }) => value);
    console.log(studentIds)
    const { data, error } = await useFetch(`${config.public.apiBase}/admin/class/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({
        class_id,
        student_ids: studentIds,
      }),
    })

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Student has been added to class',
        icon: 'i-heroicons-check-circle',
      });
      state.students = [];
    }
  } catch (error) {
    console.log(error);
  } finally {
    isAdding.value = false;
    isOpen.value = false;
    fetchClassDetails();
  }
}

async function removeStudent(row: Student) {
  isDeleting[row.id] = true;
  try {
    const { data } = await useFetch<Student>(`${config.public.apiBase}/admin/class/remove?class_id=${class_id}&student_id=${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    if (data) {
      classDetails.value.students = classDetails.value.students.filter(student => student.id !== row.id);
      toast.add({
        title: 'Success',
        description: 'Student has been removed from class',
        icon: 'i-heroicons-check-circle',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting[row.id] = false;
  }
}

onMounted(() => {
  fetchClassDetails();
  fetchStudents();
});
</script>