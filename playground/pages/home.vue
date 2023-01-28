<template>
    <div>
        <h1>Home</h1>
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
        <p>{{ user }}</p>
        <img :src="pictureUrl" height="40" />

        <form @submit.prevent="handleChangePassword">
            <label for="current-password">Current password</label>
            <input id="current-password" v-model="currentPassword" />
            <label for="newt-password">New password</label>
            <input id="new-password" v-model="newPassword" />
            <button type="submit">Change password</button>
        </form>

        <button @click="revokeSessions">Delete all my sessions</button>

        <button @click="handleGetSessions">Get sessions</button>
        <p>{{ sessions }}</p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" })

const { logout, fetchUser, useUser, changePassword, revokeSessions, getSessions } = useAuth()

const user = useUser()

const pictureUrl = computed(() => user.value?.picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png')

async function handleLogout() {
    await logout()
}

const currentPassword = ref("")
const newPassword = ref("")

async function handleChangePassword() {
    await changePassword({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
    })
}

const sessions = ref()

async function handleGetSessions() {
    const { refreshTokens } = await getSessions()
    sessions.value = refreshTokens
}
</script>