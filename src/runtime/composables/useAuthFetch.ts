import type { FetchOptions } from "ofetch";
import useAuthSession from "./useAuthSession";
import useAuth from "./useAuth";
import { defu } from "defu";
import { $fetch } from "ofetch";

export default async function <DataT>(
  path: string,
  fetchOptions: FetchOptions<"json"> = {}
): Promise<DataT> {
  const { useAccessToken, refresh } = useAuthSession();

  const { logout } = useAuth();

  const accessToken = useAccessToken();

  await refresh();

  if (!accessToken.value) {
    await logout();
    throw new Error("unauthorized");
  }

  fetchOptions.credentials = fetchOptions.credentials || "omit";

  fetchOptions.headers = defu(
    {
      Authorization: "Bearer " + accessToken.value,
    },
    fetchOptions.headers
  );

  return $fetch<DataT>(path, fetchOptions);
}
