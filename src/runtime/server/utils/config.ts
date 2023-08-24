import { useRuntimeConfig } from "#imports";
import type { PrivateConfig, PublicConfig } from "../../types";
import type { H3Event } from "h3";

export function getConfig(event?: H3Event) {
  const privateConfig = useRuntimeConfig(event).auth as PrivateConfig;
  const publicConfig = useRuntimeConfig(event).public.auth as PublicConfig;

  return { private: privateConfig, public: publicConfig };
}
