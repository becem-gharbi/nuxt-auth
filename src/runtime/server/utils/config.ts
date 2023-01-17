//@ts-ignore
import { useRuntimeConfig } from "#imports";
import type { PrivateConfig, PublicConfig } from "../../types";

export const privateConfig = useRuntimeConfig().auth as PrivateConfig;
export const publicConfig = useRuntimeConfig().public.auth as PublicConfig;
