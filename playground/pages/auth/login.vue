<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        placeholder="email"
        type="email"
        autocomplete="email"
      >
      <input
        v-model="password"
        placeholder="password"
        type="password"
        autocomplete="current-password"
      >
      <button type="submit">
        Login
      </button>
    </form>

    <p data-testid="password-reset-result">
      {{ pwResetResult }}
    </p>

    <button @click="handleRequestPasswordReset">
      Forgot password
    </button>
    <button @click="loginWithProvider('google')">
      Login with google
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuth, ref } from '#imports'

const { login, requestPasswordReset, loginWithProvider } = useAuth()

const email = ref()
const password = ref()

const pwResetResult = ref()

async function handleLogin() {
  await login({ email: email.value, password: password.value })
}

async function handleRequestPasswordReset() {
  await requestPasswordReset(email.value)
    .then(() => {
      pwResetResult.value = 'ok'
    })
    .catch((err) => {
      pwResetResult.value = err.data.message
    })
}
</script>
