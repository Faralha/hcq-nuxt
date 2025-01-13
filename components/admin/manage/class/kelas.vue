<template>
  <section class="mt-5">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-xl font-semibold">Manage Class</h2>
        <p class="opacity-60">Atur Kelas</p>
        <p>Semester {{ semester.semester }}</p>
      </div>

      <UButton v-if="isFetching" loading />
      <UButton v-else color="primary" icon="i-heroicons-plus" label="open" @click="isOpen = true">Add Class</UButton>
      <UModal v-model="isOpen" :popper="{ placement: 'bottom-end' }">
        <div class="p-4 w-full">
          <h2 class="font-semibold mb-3">Add Class</h2>

          <UForm :state="state" @submit="addClass">
            <UFormGroup label="Mentor">
              <USelectMenu searchable searchable-placeholder="Select Mentor" :options="formattedMentor" class="w-full" v-model="state.mentor" />
            </UFormGroup>

            <UFormGroup label="Kelas">
              <USelect v-model="state.jenis" label="Kelas" :options="formattedCourses" />
            </UFormGroup>

            <UFormGroup label="Semester">
              <UInput v-model="semester.semester" label="Semester" type="number" :disabled="true" />
            </UFormGroup>

            <div class="mt-3">
              <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
              <UButton v-else class="px-5" type="submit">Add</UButton>
            </div>
          </UForm>
        </div>
      </UModal>
    </div>

    <UTable v-if="isFetching" loading :columns="columns" />
    <UTable v-else :rows="kelas" :columns="columns">
      <template #actions-data="{ row }">
        <UButton v-if="isDeleting[row.id]" loading color="red">Loading</UButton>
        <UButton v-else color="red" icon="i-heroicons-trash" @click="deleteClass(row)">
          Delete
        </UButton>
      </template>

    </UTable>
  </section>
</template>

<script setup lang="ts">
interface Kelas {
  id: string,
  mentor: Mentor,
  semester: number,
  jenis: string,
  email: string,
}

interface Semester {
  semester: number;
}

interface Course {
  jenis: string,
  keterangan: string,
  created_by: string,
}

interface Mentor {
  id: string,
  name: string,
  is_verified: boolean,
  email: string,
}

const config = useRuntimeConfig();
const toast = useToast();
const kelas = ref<Kelas[]>([]);
const semester = ref<Semester>({ semester: 0 });
const course = ref<Course[]>([]);
const mentor = ref<Mentor[]>([]);
const state = reactive<Kelas>({
  id: '',
  mentor: {
    id: '',
    name: '',
    is_verified: false,
    email: '',
  },
  semester: 0,
  jenis: '',
  email: '',
});
const isOpen = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const isDeleting = reactive<Record<string, boolean>>({});

const columns = [
  { key: "id", label: "ID" },
  { key: "jenis", label: "Kelas" },
  { key: "mentor", label: "Mentor" },
  { key: "semester", label: "Semester" },
  { key: "actions", rowClass: "w-[5rem]" },
];
const formattedCourses = computed(() => {
  return course.value.map(c => ({ label: c.jenis, value: c.jenis }));
});
const formattedMentor = computed(() => {
  return mentor.value.map(m => ({ label: m.name, value: m.name, id: m.id, email: m.email }));
});

async function fetchClass() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<Kelas[]>(`${config.public.apiBase}/admin/class`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    kelas.value = data.value || [];
  } catch (error) {
    console.log(error);
  } finally {
    isFetching.value = false;
  }
}

async function fetchSemester() {
  try {
    const {data, error} = await useFetch<Semester[]>(`${config.public.apiBase}/admin/semester`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    semester.value = { semester: data.value?.[0].semester ?? 0 };
  } catch (error) {
    console.log(error);
  }
}

async function fetchCourses() {
  try {
    const { data, error } = await useFetch<Course[]>(`${config.public.apiBase}/admin/course`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    course.value = data.value || [];
  } catch (error) {
    console.error(error);
  }
}

async function fetchMentor(){
  try {
    const { data, error } = await useFetch<Mentor[]>(`${config.public.apiBase}/mentors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });
    mentor.value = data.value || [];
  } catch (error) {
    console.error(error);
  }
}

async function addClass() {
  try {
    isAdding.value = true;
    const { data, error } = await useFetch<Kelas>(`${config.public.apiBase}/admin/class`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({id_mentor: state.mentor.id, jenis: state.jenis}),
    });

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Class has been added',
        icon: 'i-heroicons-check-circle',
      });
      fetchClass();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isAdding.value = false;
    isOpen.value = false;
  }
}

async function deleteClass(row: Kelas) {
  try {
    isDeleting[row.id] = true;
    const { data, error } = await useFetch<Kelas>(`${config.public.apiBase}/admin/class`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({ id: row.id }),
    });

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Class has been deleted',
        icon: 'i-heroicons-check-circle',
      });
      fetchClass();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isDeleting[row.id] = false;
  }
}

onMounted(() => {
  fetchClass();
  fetchSemester();
  fetchCourses();
  fetchMentor();
});
</script>