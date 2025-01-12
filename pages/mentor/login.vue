<template>
  <div class="flex flex-col gap-2 h-screen items-center justify-center">
    <AuthLoginform description="Sebagai Mentor" link="/mentor" />

    <div class="flex gap-3 text-sm">
      <NuxtLink to="/mentor/register">Register</NuxtLink>
      <NuxtLink to="/login">Login sebagai Murid</NuxtLink>
    </div>
  </div>
</template>