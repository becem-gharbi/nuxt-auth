import type { Adapter } from '#build/types/auth_adapter'

export type AdapterFactory<Options> = (opts: Options) => Adapter<Options>

export function defineAdapter<Options>(factory: AdapterFactory<Options>): AdapterFactory<Options> {
  return factory
}
