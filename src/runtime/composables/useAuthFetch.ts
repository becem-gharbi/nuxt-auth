import { defu } from 'defu'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import { useAuthSession, useRequestHeaders } from '#imports'

/**
 * A wrapper of `$fetch` API that auto passes authorization header
 */
export default async function <DataT> (
  request: NitroFetchRequest,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<DataT> {
  const { getAccessToken } = useAuthSession()

  // Remove refresh token from request
  options.credentials = options.credentials ?? 'omit'

  // Pass user-agent on SSR requests
  const clientHeaders = useRequestHeaders(['user-agent'])

  // Get a freshed access token (refreshed if expired) or not
  const accessToken = await getAccessToken()

  // If the access token cannot be obtained, proceed to logout!
  if (accessToken) {
    options.headers = defu(
      {
        Authorization: 'Bearer ' + accessToken
      },
      clientHeaders,
      options.headers
    )
  }

  // @ts-ignore
  return $fetch(request, options)
}
