import { useNuxtApp } from '#imports'

export const useAuthFetch: typeof $fetch = useNuxtApp().$auth.fetch
