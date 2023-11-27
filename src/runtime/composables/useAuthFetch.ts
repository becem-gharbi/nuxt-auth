import { defu } from 'defu'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import { useAuthSession, useRequestHeaders } from '#imports'

/**
 * A wrapper of `$fetch` API that auto passes authorization header
 */
export async function useAuthFetch <T> (
  request: NitroFetchRequest,
  options?: NitroFetchOptions<NitroFetchRequest>
): Promise<T> {
  const { getAccessToken } = useAuthSession()

  const userAgent = useRequestHeaders(['user-agent'])['user-agent']
  const accessToken = await getAccessToken()

  const _options = defu(options, {
    credentials: 'omit',
    headers: accessToken && {
      authorization: 'Bearer ' + accessToken,
      'user-agent': userAgent
    }
  }) as NitroFetchOptions<NitroFetchRequest>

  return $fetch<any>(request, _options)
}
