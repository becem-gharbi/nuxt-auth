<template>
    <div>
        <h1>Login</h1>
        <button @click="handleLogin">Login</button>
        <button @click="handleRequestPasswordReset">Forgot password</button>
        <button @click="() => loginWithProvider('google')">Login with google</button>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "guest" })

const { login, requestPasswordReset, loginWithProvider } = useAuth()

async function handleLogin() {
    const { data, error } = await login({ email: "becem.gharbi96@gmail.com", password: "123456" })
}

async function handleRequestPasswordReset() {
    const { error } = await requestPasswordReset("becem.gharbi96@gmail.com")
    console.log(error.value?.data.errors[0].message)
}
</script>