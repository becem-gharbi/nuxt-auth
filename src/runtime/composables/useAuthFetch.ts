import useAuth from "./useAuth";
import { defu } from "defu";
import type { FetchOptions } from "ofetch";
import { $fetch } from "ofetch";

export default async function <DataT>(
  path: string,
  fetchOptions: FetchOptions<"json"> = {}
): Promise<DataT> {
  const { useAccessToken, prefetch } = useAuth();

  await prefetch();

  const accessToken = useAccessToken();

  fetchOptions.headers = defu(
    {
      Authorization: "Bearer " + accessToken.value,
    },
    fetchOptions.headers
  );

  return $fetch<DataT>(path, fetchOptions);
}
