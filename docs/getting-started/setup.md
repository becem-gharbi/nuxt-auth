# Setup

## Install the module

First add `@bg-dev/nuxt-auth` dependency to your project

```bash
npx nuxi module add @bg-dev/nuxt-auth
```

## Data integration

The module implements JWT-based session so authorization is stateless. To have control over sessions and provide user related functionalities (e.g registration), data needs to be persisted. The module offers two options either frontend-only with backend API or full-stack with data adapter.

### Frontend-only

The module provides a frontend-only option that turns off the built-in backend by excluding the server's handlers, utilities and middlewares and permits users to bring their own. The provided backend can be internal, meaning as part of the application, or external.

This feature does not effect the Frontend implementation meaning same APIs and benefits (auto-redirection, auto-refresh of token) as the full-stack implementation.

The specification for the backend APIs is provided [here](https://app.swaggerhub.com/apis-docs/becem-gharbi/nuxt-auth).

To enable this feature, these config options should be set:

- `backendEnabled` set to `false`.
- `backendBaseUrl` set to `/` for internal Backend.

### Full-stack

Two models are required `User` and `Session` with one-to-many relation.

```ts
interface User {
  id: UserId; // default `string`
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
  id: SessionId; // default `string`
  uid: string;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: User["id"];
}
```

The module provides data layer integration via adapters. An adapter is an object with methods for read and write.

```ts
interface Adapter {
  name: string;
  source: Source; // The data source, e.g Prisma client

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
      excludeId?: Session["id"]
    ) => Promise<void>;
  };
}
```

An adapter can be defined with `defineAdapter` utility and needs to be provided with `setEventContext`.

```ts
import { defineAdapter, setEventContext } from "#auth_utils";

const useAdapter = defineAdapter<Source>((source)=> {/* */});

export default defineNitroPlugin((nitroApp) => {
    const adapter = useAdapter()

    nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
  }
});
```

### Prisma adapter

The module provides a ready to use adapter for [Prisma ORM](https://prisma.io/).

```ts
import { PrismaClient } from "@prisma/client";
import { usePrismaAdapter, setEventContext } from "#auth_utils";

declare module "#auth_adapter" {
  type Source = PrismaClient; // for typing `event.context.auth.adapter.source`
  type UserId = number; // to change User ID type to `number`
  type SessionId = number; // to change Session ID type to `number`
}

export default defineNitroPlugin((nitroApp) => {
  const prisma = new PrismaClient();
  const adapter = usePrismaAdapter(prisma);

  nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
});
```

### Unstorage adapter

The module provides a ready to use adapter for [Unstorage](https://unstorage.unjs.io/).

```ts
import { useUnstorageAdapter, setEventContext } from "#auth_utils";

export default defineNitroPlugin((nitroApp) => {
    const storage = useStorage()
    const adapter = useUnstorageAdapter(storage)

    nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
  }
});
```
