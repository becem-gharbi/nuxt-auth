# Data integration

The module implements a JWT-based session so authorization is stateless. Data needs to be persisted to have control over sessions and provide user-related functionalities (e.g. registration). For that, the module offers two options: Frontend-only with backend API or Full-stack with data adapter.

## Frontend-only

The module provides a frontend-only option that turns off the built-in backend by excluding the server's handlers, utilities, and middleware and permits users to bring their own. The provided backend can be internal, meaning as part of the application, or external.

This feature does not affect the frontend implementation meaning the same APIs and benefits (auto-redirection, auto-refresh of token) as the full-stack implementation.

The specification for the backend APIs is described [here](https://app.swaggerhub.com/apis-docs/becem-gharbi/nuxt-auth).

To enable this feature, these config options should be set:

- `backendEnabled` set to `false`.
- `backendBaseUrl` set to `/` for internal Backend.

## Full-stack

The full-stack option requires a data source adapter. An adapter is an object with methods for reading and writing the required data models. You can use a [built-in adapter](/getting-started/adapters) or create your own.

To create a custom adapter two models are required:

- `User` to store a user's data.
- `Session` to store a session's data for a specific user.

```ts
interface User {
  id: UserId;
  name: string;
  email: string;
  picture: string;
  role: string;
  provider: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  suspended?: boolean | null;
  password?: string | null;
  requestedPasswordReset?: boolean | null;
}

interface Session {
  id: SessionId;
  uid: string;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: User["id"];
}
```

By default, the `id` fields are of type `string`. To change it to `number`, the `UserId` and `SessionId` types need to be overwritten:

```ts
declare module "#auth_adapter" {
  type UserId = number; // Change User ID type to `number`
  type SessionId = number; // Change Session ID type to `number`
}
```

To define a new adapter, the `defineAdapter` utility is provided. The expected argument is the data source, the API you use to interact with your data (e.g. Prisma Client).

```ts
interface Adapter {
  name: string;
  source: Source;

  user: {
    findById: (id: User["id"]) => Promise<User | null>;
    findByEmail: (email: User["email"]) => Promise<User | null>;
    create: (input: UserCreateInput) => Promise<UserCreateOutput>;
    update: (id: User["id"], input: UserUpdateInput) => Promise<void>;
  };

  session: {
    findById: (
      id: Session["id"],
      userId: User["id"]
    ) => Promise<Session | null>;
    findManyByUserId: (id: User["id"]) => Promise<Session[]>;
    create: (input: SessionCreateInput) => Promise<SessionCreateOutput>;
    update: (id: Session["id"], input: SessionUpdateInput) => Promise<void>;
    delete: (id: Session["id"], userId: User["id"]) => Promise<void>;
    deleteManyByUserId: (
      userId: User["id"],
      excludeId?: Session["id"] // The current session's id, it should not be deleted.
    ) => Promise<void>;
  };
}
```

To integrate your adapter within your application, the `setEventContext` utility is provided. It extends `event.context` with the `auth` property that contains the access token's payload on `auth.data` and the adapter instance on `auth.adapter`.

```ts
import { defineAdapter, setEventContext } from "#auth_utils";

const useAdapter = defineAdapter<SourceType>((source)=> {/* */});

export default defineNitroPlugin((nitroApp) => {
    const adapter = useAdapter()
    nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
  }
});
```

On your event handlers, the data source used by the adapter can be accessed on `event.context.auth.adapter.source`. Note that it needs to be manually typed:

```ts
declare module "#auth_adapter" {
  type Source = SourceType;
}
```
