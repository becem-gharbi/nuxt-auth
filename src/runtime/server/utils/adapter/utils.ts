import type { Adapter } from '#build/types/auth_adapter'

type AdapterFactory<Options> = (opts?: Options) => Adapter<Options>

export function defineAdapter<Options>(factory: AdapterFactory<Options>): AdapterFactory<Options> {
  return factory
}
