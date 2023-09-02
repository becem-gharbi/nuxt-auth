import type { PrivateConfig, PublicConfig } from '../../types'
import { useRuntimeConfig } from '#imports'

export function getConfig () {
  const privateConfig = useRuntimeConfig().auth as PrivateConfig
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  return { private: privateConfig, public: publicConfig }
}
