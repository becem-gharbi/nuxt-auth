import { useRuntimeConfig, UseFetchOptions, useFetch } from "#app";
import useDirectusAuth from "./useDirectusAuth";
import { defu } from "defu";
import type {
  UseFetchDataT,
  UseFetchErrorT,
  UseDirectusFetchReturn,
} from "../types";

export default async function <DataT>(
  path: string,
  fetchOptions: UseFetchOptions<DataT> = {}
): UseDirectusFetchReturn<DataT> {
  const { directusAuth } = useRuntimeConfig().public;

  const { refresh, useAccessToken, isAccessTokenExpired, logout } =
    useDirectusAuth();

  const accessToken = useAccessToken();

  if (accessToken.value) {
    if (isAccessTokenExpired()) {
      await refresh();
      if (!accessToken.value) {
        await logout();
        throw new Error("Unauthorized");
      }
    }

    fetchOptions.headers = defu(
      {
        Authorization: "Bearer " + accessToken.value,
      },
      fetchOptions.headers
    );
  }

  return useFetch<UseFetchDataT<DataT>, UseFetchErrorT>(path, fetchOptions);
}
