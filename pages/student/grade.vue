<template>
  <section class="container-verysmall py-[5rem]">
    <h1 class="text-3xl font-bold">Grade</h1>
    <p class="opacity-60">Nilai</p>

    <!-- GRADE TABLE -->
    <section class="mt-5">
      <USkeleton v-if="isFetching" class="w-full h-[3rem]" />
      <div v-else v-for="(grades, semester) in groupedGrades" :key="semester" class="mb-8">
        <h2 class="text-xl font-semibold">Semester {{ semester }}</h2>
        <UTable :rows="grades" :columns="columns" />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
interface Grade {
  grade: number,
  id_class: string,
  semester: number,
  jenis: string,
}

const config = useRuntimeConfig();
const grade = ref<Grade[]>([]);
const groupedGrades = ref<Record<number, Grade[]>>({});

const isFetching = ref < boolean > (false);

const columns = [
  { key: "jenis", label: "Kelas" },
  { key: "id_class", label: "ID Kelas" },
  { key: "semester", label: "Semester" },
  { key: "grade", label: "Nilai" },
]

async function fetchGrade() {
  try {
    isFetching.value = true;
    const { data, error } = await useFetch<Grade[]>(`${config.public.apiBase}/grade`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      server: false,
    });

    if (data && data.value) {
      grade.value = data.value.map(grade => ({
        ...grade,
        grade: grade.grade ?? 0,
      }));
      groupGradesBySemester();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isFetching.value = false;
  }
}

function groupGradesBySemester() {
  const grouped = grade.value.reduce((acc, curr) => {
    if (!acc[curr.semester]) {
      acc[curr.semester] = [];
    }
    acc[curr.semester].push(curr);
    return acc;
  }, {} as Record<number, Grade[]>);
  groupedGrades.value = grouped;
}

onMounted(() => {
  fetchGrade();
})

</script>