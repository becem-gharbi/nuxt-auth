<template>
    <div>
        <h1>Register</h1>
        <button @click="handleRegister">Register</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { register } = useAuth()

async function handleRegister() {
    const { data, error } = await register({
        email: "becem.gharbi96@gmail.com",
        password: "123456"
    })
}
</script>