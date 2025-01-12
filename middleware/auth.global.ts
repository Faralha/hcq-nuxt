export default defineNuxtRouteMiddleware(async (to, from) => {
  // BYPASS AUTH ROUTES
  const publicPaths = [
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
    "/mentor/login",
    "/mentor/register",
  ];

  if (publicPaths.includes(to.path)) {
    return;
  }

  // CHECK SESSION TOKEN VALIDITY
  const config = useRuntimeConfig();
  try {
    await $fetch(`${config.public.apiBase}/token`, {
      credentials: "include",
    });

    return;
  } catch (error) {
    return navigateTo("/login");
  }
});