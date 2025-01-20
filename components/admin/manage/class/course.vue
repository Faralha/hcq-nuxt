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
                <UInput v-model="courseState.name" label="Mata Kuliah" />
              </UFormGroup>
              <UFormGroup label="Keterangan">
                <UInput v-model="courseState.description" label="Keterangan" />
              </UFormGroup>
              <UFormGroup label="Fee">
                <UInput v-model="courseState.fee" label="Fee" />
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
  name: string,
  description: string,
  author: string,
  fee: number,
}

const toast = useToast();
const config = useRuntimeConfig();
const course = ref<Course[]>([]);
const columns = [
  { key: "name", label: "Mata Kuliah" },
  { key: "description", label: "Keterangan" },
  { key: "fee", label: "Fee" },
  { key: "author", label: "Created By" },
  { key: "actions", rowClass: "w-[5rem]" },
];
const isFetching = ref<boolean>(false);
const isAdding = ref<boolean>(false);
const isDeleting = reactive<Record<string, boolean>>({});
const courseState = reactive<Course>({
  name: '',
  description: '',
  author: '',
  fee: 0,
});

// Signal to notify Kelas Component fetchCourses
const emit = defineEmits(['fetchCourses']);

async function fetchCourses() {
  try {
    emit('fetchCourses');
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
    } else
      toast.add({
        title: 'Error',
        description: error.value?.message || 'An error occurred',
        icon: 'i-heroicons-x-circle',
      });
  } catch (error) {

  } finally {
    isAdding.value = false;
  }
}

async function deleteCourse(row: Course) {
  try {
    isDeleting[row.name] = true;
    const { data, error, status } = await useFetch<Course>(`${config.public.apiBase}/admin/course`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
      body: JSON.stringify({ name: row.name }),
    });

    if (status.value === 'success') {
      toast.add({
        title: 'Success',
        description: 'Course has been deleted',
        icon: 'i-heroicons-check-circle',
      });
      fetchCourses();
    } else {
      toast.add({
        title: 'Error',
        description: error.value?.message || 'An error occurred',
        icon: 'i-heroicons-x-circle',
      });
    }

  } catch (error) {
    console.log(error);
    toast.add({
      title: 'Error',
      description: 'An error occurred',
      icon: 'i-heroicons-x-circle',
    });
  } finally {
    isDeleting[row.name] = false;
  }
}

onMounted(() => {
  fetchCourses();
});
</script>