<template>
  <div>
    <h1>Reset password</h1>

    <form @submit.prevent="handleResetPassword">
      <input
        v-model="password"
        placeholder="new password"
        autocomplete="new-password"
      >
      <button type="submit">
        Reset password
      </button>
    </form>
  </div>
</template>

<script setup>
import { definePageMeta, useAuth, ref } from '#imports'

definePageMeta({ middleware: 'guest' })

const { resetPassword } = useAuth()

const password = ref()

async function handleResetPassword() {
  await resetPassword(password.value)
}
</script>
