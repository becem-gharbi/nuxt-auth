import { defu } from 'defu'
import type {
  NitroFetchRequest, NitroFetchOptions,
  AvailableRouterMethod
} from 'nitropack'
import { useAuthSession, useRequestHeaders } from '#imports'

/**
 * A wrapper of `$fetch` API that auto passes authorization header
 */
export async function useAuthFetch <T = unknown, R extends NitroFetchRequest = NitroFetchRequest, O extends NitroFetchOptions<R, AvailableRouterMethod<R>> = NitroFetchOptions<R, AvailableRouterMethod<R>>> (
  request: R,
  options?: O
): ReturnType<typeof $fetch<T, R, O>> {
  const { getAccessToken } = useAuthSession()

  const userAgent = useRequestHeaders(['user-agent'])['user-agent']
  const accessToken = await getAccessToken()

  const _options = defu(options, {
    credentials: 'omit',
    headers: accessToken && {
      authorization: 'Bearer ' + accessToken,
      'user-agent': userAgent
    }
  }) as O

  return $fetch<T, R, O>(request, _options)
}
