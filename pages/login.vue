<template>
  <div class="flex flex-col gap-2 h-screen items-center justify-center">
    <AuthLoginform description="Sebagai murid" title="Login" />
    
    <div class="flex gap-3 text-sm">
      <NuxtLink to="/register">Register</NuxtLink>
      <NuxtLink to="/mentor/login">Login sebagai Mentor</NuxtLink>
    </div>
  </div>
</template>