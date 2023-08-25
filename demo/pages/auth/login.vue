<template>
    <div>
        <h1>Login</h1>
        <button @click="handleLogin">Login</button>
        <button @click="handleRequestPasswordReset">Forgot password</button>
        <button @click="() => loginWithProvider('google')">Login with google</button>
    </div>
</template>

<script setup lang="ts">
const { login, requestPasswordReset, loginWithProvider } = useAuth()

async function handleLogin() {
    const { data, error } = await login({ email: "tester1@test.com", password: "abc123" })
}

async function handleRequestPasswordReset() {
    const { error } = await requestPasswordReset("tester1@test.com")
    console.log(error.value?.data?.message)
}
</script>