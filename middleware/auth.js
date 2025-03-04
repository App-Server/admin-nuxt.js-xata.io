// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('authToken')
    if (!token.value) {
      return navigateTo('/login')
    }
})

