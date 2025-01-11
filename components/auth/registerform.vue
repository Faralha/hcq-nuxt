<template>
  <div>
    <UForm class="flex w-[20rem] flex-col gap-2" :state="state">
      <span>
        <h1 class="text-xl font-bold m-0">{{ title }}</h1>
        <p class="opacity-70 m-0">{{ description }}</p>
      </span>
      
      
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Full Name" name="fullname">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup label="Phone Number" name="number">
        <UInput v-model="state.phone_number" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" class="mt-3 justify-center">Register</UButton>
    </UForm>
  </div>
</template>

<script setup>
  const state = reactive({
    email: undefined,
    password: undefined,
    name: undefined,
    phone_number: undefined,
  })

  const props = defineProps({
    title: {
      type: String,
      default: 'Register'
    },
    description: {
      type: String,
      default: 'Sebagai Student'
    }
  })

</script>

<style scoped>

</style>