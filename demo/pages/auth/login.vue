<template>
    <div>
        <h1>Login</h1>

        <form @submit.prevent="handleLogin">
            <input placeholder="email" v-model="email" type="email" autocomplete="email">
            <input placeholder="password" v-model="password" type="password" autocomplete="current-password">
            <button type="submit">Login</button>
        </form>

        <button @click="handleRequestPasswordReset">Forgot password</button>
        <button @click="() => loginWithProvider('google')">Login with google</button>
    </div>
</template>

<script setup lang="ts">
const { login, requestPasswordReset, loginWithProvider } = useAuth()

const email = ref()
const password = ref()

async function handleLogin() {
    const { data, error } = await login({ email: email.value, password: password.value })
}

async function handleRequestPasswordReset() {
    const { error } = await requestPasswordReset(email.value)
    console.log(error.value?.data?.message)
}
</script>