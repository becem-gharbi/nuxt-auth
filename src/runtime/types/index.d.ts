import type { AsyncData } from "#app";

export type AuthProvider =
  | "google"
  | "facebook"
  | "twitter"
  | "microsoft"
  | "okta"
  | "auth0"
  | "keycloak"
  | "github"
  | "discord"
  | "twitch"
  | "apple";

export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  location?: string;
  title?: string;
  description?: string;
  tags?: string;
  avatar?: string;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  status?: string;
  role?: string;
  token?: string;
  last_access?: string;
  last_page?: string;
  provider?: string;
};

export type ResponseLogin = {
  access_token: string;
};

export type ResponseRefresh = {
  data: {
    access_token: string;
  };
};

type ErrorT = {
  errors: {
    message: string;
    extensions: {
      code: string;
      collection: string;
      field: string;
      invalid: string;
    };
  }[];
};

export type UseFetchDataT<T> = {
  data: T;
} | null;

export type UseFetchErrorT = {
  data: ErrorT;
} | null;

export type UseDirectusFetchReturn<T> = Promise<
  AsyncData<UseFetchDataT<T>, UseFetchErrorT>
>;


export type User {
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  locale?: string;
  phone_number?: string;
  updated_at?: number;
  created_at?: number;
}