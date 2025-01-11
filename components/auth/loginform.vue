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

      <UButton type="submit" class="mt-3 justify-center">Login</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

interface Schema {
  email: string;
  password: string;
}

const state = reactive<Schema>({
  email: "",
  password: "",
});

const form = ref<Form<Schema>>();

const config = useRuntimeConfig();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await $fetch(`${config.public.apiBase}/login`, {
      method: "POST",
      body: state,
      credentials: 'include'
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const props = defineProps({
  title: {
    type: String,
    default: "Login"
  },
  description: {
    type: String,
    default: "Sebagai Student"
  },
});
</script>

<style scoped></style>
