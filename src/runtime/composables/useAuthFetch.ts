import { defu } from 'defu'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import { useAuthSession, useRequestHeaders } from '#imports'

/**
 * @deprecated since version 2.2.1, please use `useNuxtApp().$auth.fetch() instead`
 */
export async function useAuthFetch <T> (
  request: NitroFetchRequest,
  options?: NitroFetchOptions<NitroFetchRequest>
): Promise<T> {
  const userAgent = useRequestHeaders(['user-agent'])['user-agent']
  const accessToken = await useAuthSession().getAccessToken()

  const _options = defu(options, {
    credentials: 'omit',
    headers: accessToken && {
      authorization: 'Bearer ' + accessToken,
      'user-agent': userAgent
    }
  }) as NitroFetchOptions<NitroFetchRequest>

  return $fetch<any>(request, _options)
}
