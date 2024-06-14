# Middleware

The module comes equipped with both client-side and server-side middleware, essential for redirection and authorization functionalities.

## Client-side

For seamless navigation and authorization on the client-side, the module offers two distinct approaches to page redirection, which can be utilized individually or combined for enhanced flexibility:

### Global Configuration

Enable redirection globally by setting the `enableGlobalAuthMiddleware` configuration option to `true`, with the ability to override this behavior on specific pages using the `auth` page meta.

```vue
<script setup lang="ts">
definePageMeta({ auth: false });
</script>
```

### Local Configuration

Fine-tune redirection behavior on a per-page basis using the `auth` and `guest` middleware.

```vue
<script setup lang="ts">
definePageMeta({ middleware: "auth" }); // Redirects to login route when not loggedIn.

definePageMeta({ middleware: "guest" }); // Redirects to home route when loggedIn.
</script>
```

## Server-side

On the server-side, authorization is seamlessly managed through access to the access token's payload via the `event.context.auth.data` property. This allows for easy validation to reject unauthorized calls.
