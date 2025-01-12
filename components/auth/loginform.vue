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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response:any = await $fetch(`${config.public.apiBase}${props.link}/login`, {
      method: "POST",
      body: state,
      credentials: 'include'
    });
    if (response.status == 'success') {
      error.value = null;
      await navigateTo('/');
    } else {
      error.value = response.message || 'An error occured';
    }
  } catch (err: any) {
    console.error(err);
    error.value = err.message.message || 'An error occured';
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
