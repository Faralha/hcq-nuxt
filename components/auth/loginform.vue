<template>
  <div>
    <UForm
      class="w-[16rem] flex flex-col gap-2"
      :state="state"
      @submit="onSubmit">
      <span>
        <h1 class="text-xl font-bold m-0">{{ title }}</h1>
        <p class="opacity-70 m-0">{{ description }}</p>
      </span>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton v-if="isLoading" class="mt-3 justify-center" loading>Loading</UButton>
      <UButton v-else type="submit" class="mt-3 justify-center">Login</UButton>
    
      <!-- POP-UP ALERT -->
      <UAlert
        v-if="error"
        icon="i-heroicons-x-circle"
        color="red"
        variant="solid"
        title="Error"
        :description="error" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const error = ref<string | null>(null);

interface Schema {
  email: string;
  password: string;
}

const state = reactive<Schema>({
  email: "",
  password: "",
});

const isLoading = ref<boolean>(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  try {
    const response:any = await $fetch(`${config.public.apiBase}${props.link}/login`, {
      method: "POST",
      body: state,
      credentials: 'include'
    });
    if (response.status == 'success') {
      error.value = null;
      await navigateTo(
        `${props.link}/`
      );
    } else {
      error.value = "Wrong Email or Password!";
    }
  } catch (err: any) {
    error.value = "Wrong Email or Password!";
  } finally {
    isLoading.value = false;
  }
}

const props = defineProps({
  title: {
    type: String,
    default: "Login"
  },
  description: {
    type: String,
    default: "Sebagai Murid"
  },
  link: {
    type: String,
    default: ""
  }
});
</script>

<style scoped></style>
