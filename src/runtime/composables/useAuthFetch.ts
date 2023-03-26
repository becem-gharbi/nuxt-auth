import useAuthSession from "./useAuthSession";
import useAuth from "./useAuth";
import { defu } from "defu";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

export default async function <DataT>(
  request: NitroFetchRequest,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<DataT> {
  const { getAccessToken } = useAuthSession();

  const { logout } = useAuth();

  const accessToken = await getAccessToken();

  if (!accessToken) {
    await logout();
    throw new Error("unauthorized");
  }

  options.credentials = options.credentials || "omit";

  options.headers = defu(
    {
      Authorization: "Bearer " + accessToken,
    },
    options.headers
  );

  return $fetch(request, options);
}
