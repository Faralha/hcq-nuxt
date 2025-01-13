<template>
  <section class="mt-5">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-xl font-semibold">Manage Course</h2>
        <p class="opacity-60">Atur Mata Kuliah</p>
      </div>

      <UButton v-if="isFetching" loading />
      <UPopover v-else :popper="{ placement: 'bottom-end' }">
        <UButton color="primary" icon="i-heroicons-plus" label="open">Add Course</UButton>
        <template #panel>
          <div class="p-4">
            <UForm :state="courseState" @submit="addCourse">
              <UFormGroup label="Mata Kuliah">
                <UInput v-model="courseState.jenis" label="Mata Kuliah" />
              </UFormGroup>
              <UFormGroup label="Keterangan">
                <UInput v-model="courseState.keterangan" label="Keterangan" />
              </UFormGroup>
              <div class="mt-3">
                <UButton v-if="isAdding" loading class="px-5">Loading</UButton>
                <UButton v-else class="px-5" type="submit">Add</UButton>
              </div>
            </UForm>
          </div>
        </template>
      </UPopover>
    </div>

    <UTable v-if="isFetching" loading :columns="columns" />
    <UTable v-else :rows="course" :columns="columns">
      <template #actions-data="{ row }">
        <UButton v-if="isDeleting[row.jenis]" loading color="red">Loading</UButton>
        <UButton v-else color="red" icon="i-heroicons-trash" @click="deleteCourse(row)">
          Delete
        </UButton>
      </template>
    </UTable>
  </section>
</template>

<script setup lang="ts">
interface Course {
  jenis: string,
  keterangan: string,
  created_by: string,
}

const toast = useToast();
const config = useRuntimeConfig();
const course = ref<Course[]>([]);
const columns = [
  { key: "jenis", label: "Mata Kuliah" },
  { key: "keterangan", label: "Keterangan" },
  { key: "created_by", label: "Created By" },
  { key: "actions", rowClass: "w-[5rem]" },
];
const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const isDeleting = reactive<Record<string, boolean>>({});
const courseState = reactive<Course>({
  jenis: '',
  keterangan: '',
  created_by: '',
});

async function fetchCourses() {
  try {
    isFetching.value = true;
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
  } finally {
    isFetching.value = false;
  }
}

async function addCourse() {
  try {
    isAdding.value = true;
    const { data, error } = await useFetch<Course>(`${config.public.apiBase}/admin/course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify(courseState),
    });

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Course has been added',
        icon: 'i-heroicons-check-circle',
      });
      fetchCourses();
    }
  } catch (error) {

  } finally {
    isAdding.value = false;
  }
}

async function deleteCourse(row: Course) {
  try {
    isDeleting[row.jenis] = true;
    const { data, error } = await useFetch<Course>(`${config.public.apiBase}/admin/course`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({ jenis: row.jenis }),
    });

    if (data) {
      toast.add({
        title: 'Success',
        description: 'Course has been deleted',
        icon: 'i-heroicons-check-circle',
      });
      fetchCourses();
    }
  } catch (error) {

  } finally {
    isDeleting[row.jenis] = false;
  }
}

onMounted(() => {
  fetchCourses();
});
</script>