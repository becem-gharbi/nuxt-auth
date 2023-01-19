import useAuth from "./useAuth";
import { defu } from "defu";
import type { FetchOptions } from "ohmyfetch";

export default async function <DataT>(
  path: string,
  fetchOptions: FetchOptions = {}
): Promise<DataT> {
  const { useAccessToken, prefetch } = useAuth();

  const accessToken = useAccessToken();

  await prefetch();

  if (accessToken.value) {
    fetchOptions.headers = defu(
      {
        Authorization: "Bearer " + accessToken.value,
      },
      fetchOptions.headers
    );
  }

  return $fetch<DataT>(path, fetchOptions);
}
