<template>
  <div>
    <h1>Register</h1>

    <form @submit.prevent="handleRegister">
      <input
        v-model="name"
        placeholder="name"
      >
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
        autocomplete="new-password"
      >
      <button type="submit">
        Register
      </button>
    </form>

    <p data-testid="registration-result">
      {{ result }}
    </p>

    <button @click="requestEmailVerifyHandler">
      Request email verify
    </button>
  </div>
</template>

<script setup>
import { definePageMeta, useAuth, ref } from '#imports'

definePageMeta({ middleware: 'guest' })

const { register, requestEmailVerify } = useAuth()

const email = ref()
const password = ref()
const name = ref()

const result = ref()

async function handleRegister() {
  await register({
    email: email.value,
    password: password.value,
    name: name.value,
  }).then(() => {
    result.value = 'ok'
  }).catch((err) => {
    result.value = err.data.message
  })
}

async function requestEmailVerifyHandler() {
  await requestEmailVerify(email.value)
}
</script>
