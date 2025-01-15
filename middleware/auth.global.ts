export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
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
  
  // ADMIN
  if (to.path.startsWith("/admin")) {
    try {
      await $fetch(`${config.public.apiBase}/auth/admin`, {
        credentials: "include",
      });

      return;
    } catch (error) {
      console.log(error);
      return navigateTo("/admin/login");
    }
  }
  
  // MENTOR
  else if (to.path.startsWith("/mentor")) {
    try {
      await $fetch(`${config.public.apiBase}/auth/mentor`, {
        credentials: "include",
      });

      return;
    } catch (error) {
      return navigateTo("/mentor/login");
    }
  }
  
  else {
    // CHECK SESSION TOKEN VALIDITY
    try {
      await $fetch(`${config.public.apiBase}/token`, {
        credentials: "include",
      });

      return;
    } catch (error) {
      return navigateTo("/login");
    }
  }

});