import { useRuntimeConfig } from '#imports'

export function getConfig () {
  const privateConfig = useRuntimeConfig().auth
  const publicConfig = useRuntimeConfig().public.auth

  return { private: privateConfig, public: publicConfig }
}
