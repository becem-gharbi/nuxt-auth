# Adapters

The module provides a set of ready-to-use adapters where their source code is available [here](https://github.com/becem-gharbi/nuxt-auth/tree/main/src/runtime/server/utils/adapter). Please make sure to add their respective Nitro plugin to your application.

## Prisma

The module provides a ready to use adapter for [Prisma ORM](https://prisma.io/).

```ts
import { PrismaClient } from "@prisma/client";
import { usePrismaAdapter, setEventContext } from "#auth_utils";

declare module "#auth_adapter" {
  type Source = PrismaClient;
}

export default defineNitroPlugin((nitroApp) => {
  const prisma = new PrismaClient();
  const adapter = usePrismaAdapter(prisma);
  nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
});
```

## Unstorage

The module provides a ready to use adapter for [Unstorage](https://unstorage.unjs.io/).

```ts
import { useUnstorageAdapter, setEventContext } from "#auth_utils";
import type { Storage } from 'unstorage'

declare module "#auth_adapter" {
  type Source = Storage;
}

export default defineNitroPlugin((nitroApp) => {
    const storage = useStorage()
    const adapter = useUnstorageAdapter(storage)

    nitroApp.hooks.hook("request", (event) => setEventContext(event, adapter));
  }
});
```
