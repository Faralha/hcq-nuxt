<template>
  <div>
    <!-- FORMS -->
    <UForm
      class="flex w-[20rem] flex-col gap-2"
      :state="state"
      @submit="onSubmit">
      <span>
        <h1 class="text-xl font-bold m-0">Register</h1>
        <p class="opacity-70 m-0">Sebagai Admin</p>
      </span>

      <UFormGroup label="Token" name="token">
        <UInput v-model="state.token" type="password" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Full Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup label="Phone Number" name="number">
        <UInput v-model="state.phonenumber" type="number" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton v-if="isLoading" class="mt-3 justify-center" loading>Loading</UButton>
      <UButton v-else type="submit" class="mt-3 justify-center">Register</UButton>

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
import type { FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

interface Schema {
  token: string,
  email: string;
  password: string;
  name: string;
  phonenumber: number;
}

const state = reactive<Schema>({
  token: "",
  email: "",
  password: "",
  name: "",
  phonenumber: 0,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    console.log(state);
    const response:any = await $fetch(`${config.public.apiBase}/admin/register`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 'success') {
      error.value = null;
      await navigateTo(`/admin/login`);
    } else {
      error.value = response.message || "An error occurred";
    }
  } catch (err: any) {
    error.value = err.message || "An error occurred";
  } finally {
    isLoading.value = false;
  }
}

</script>

<style scoped></style>
