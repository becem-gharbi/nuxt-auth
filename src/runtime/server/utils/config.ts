import type { PublicConfig, PrivateConfig } from '../../types/config'
import { useRuntimeConfig } from '#imports'

export function getConfig() {
  const privateConfig = useRuntimeConfig().auth as PrivateConfig & { backendEnabled: true }
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  return { private: privateConfig, public: publicConfig }
}
