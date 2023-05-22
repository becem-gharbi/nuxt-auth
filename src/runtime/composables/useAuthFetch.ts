import useAuthSession from "./useAuthSession";
import useAuth from "./useAuth";
import { defu } from "defu";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

/**
 * A wrapper of `$fetch` API that auto passes authorization header
 */
export default async function <DataT>(
  request: NitroFetchRequest,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<DataT> {
  const { getAccessToken } = useAuthSession();

  const { logout } = useAuth();

  // Get a freshed access token (refreshed if expired) or not
  const accessToken = await getAccessToken();

  // If the access token cannot be obtained, proceed to logout!
  if (!accessToken) {
    await logout();
    throw new Error("unauthorized");
  }

  // Remove refresh token from request
  options.credentials = options.credentials || "omit";

  options.headers = defu(
    {
      Authorization: "Bearer " + accessToken,
    },
    options.headers
  );

  return $fetch(request, options);
}
