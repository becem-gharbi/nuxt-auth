<template>
  <div>
    <h1>Home</h1>
    <button @click="fetchUser">
      Fetch user
    </button>
    <button @click="handleLogout">
      Logout
    </button>
    <p data-testid="user-info">
      {{ user }}
    </p>

    <img
      :src="user?.picture"
      height="40"
    >

    <form @submit.prevent="handleChangePassword">
      <label for="current-password">Current password</label>
      <input
        id="current-password"
        v-model="currentPassword"
      >
      <label for="newt-password">New password</label>
      <input
        id="new-password"
        v-model="newPassword"
      >
      <button type="submit">
        Change password
      </button>
    </form>

    <ul v-if="data">
      <li
        v-for="session of data"
        :key="session.id"
      >
        <p>{{ session }}</p>
        <button @click="revokeSession(session.id)">
          revoke
        </button>
      </li>
    </ul>

    <button @click="() => refresh()">
      Update sessions
    </button>

    <button @click="revokeAllSessions">
      Delete all my sessions
    </button>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAuth, useAuthSession, ref, useAsyncData } from '#imports'

definePageMeta({ middleware: 'auth' })

const { logout, fetchUser, changePassword } = useAuth()
const { user, revokeAllSessions, getAllSessions, revokeSession } = useAuthSession()

async function handleLogout() {
  await logout()
}

const currentPassword = ref('')
const newPassword = ref('')

async function handleChangePassword() {
  await changePassword({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })
}

const { data, refresh } = await useAsyncData(getAllSessions)
</script>
