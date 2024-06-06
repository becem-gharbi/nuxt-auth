import type { Adapter } from '#build/types/auth_adapter'

export type AdapterFactory<Source> = (source: Source) => Adapter<Source>

export function defineAdapter<Source>(factory: AdapterFactory<Source>): AdapterFactory<Source> {
  return factory
}
