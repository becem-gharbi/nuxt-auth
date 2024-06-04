import type { Adapter } from '../../../types'

type AdapterFactory<Options> = (opts?: Options) => Adapter<Options>

export function defineAdapter<Options>(factory: AdapterFactory<Options>): AdapterFactory<Options> {
  return factory
}
