<template>
    <div>
        <h1>Register</h1>
        <button @click="handleRegister">Register</button>
        <button @click="requestEmailVerifyHandler">Request email verify</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { register, requestEmailVerify } = useAuth()

async function handleRegister() {
    const { data, error } = await register({
        email: "becem.gharbi96@gmail.com",
        password: "123456",
        name: "becem"
    })
}

async function requestEmailVerifyHandler() {
    const { data, error } = await requestEmailVerify({
        email: "becem.gharbi96@gmail.com"
    })
}
</script>