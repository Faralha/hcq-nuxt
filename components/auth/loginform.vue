<template>
  <div>
    <UForm class="w-[16rem] flex flex-col gap-2">
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

<script setup>
  const state = reactive({
    email: '',
    password: '',
  })

  const props = defineProps({
    title: {
      type: String,
      default: 'Login'
    },
    description: {
      type: String,
      default: 'Sebagai Student'
    }
  })
</script>

<style scoped>

</style>