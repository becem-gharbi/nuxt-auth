<template>
    <div>
        <h1>Register</h1>

        <form @submit.prevent="handleRegister">
            <input placeholder="name" v-model="name">
            <input placeholder="email" v-model="email" type="email" autocomplete="email">
            <input placeholder="password" v-model="password" type="password" autocomplete="new-password">
            <button type="submit">Register</button>
        </form>

        <button @click="requestEmailVerifyHandler">Request email verify</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { register, requestEmailVerify } = useAuth()

const email = ref()
const password = ref()
const name = ref()

async function handleRegister() {
    const { data, error } = await register({
        email: email.value,
        password: password.value,
        name: name.value
    })
}

async function requestEmailVerifyHandler() {
    const { error } = await requestEmailVerify(email.value)
    console.log(error.value?.data.message)
}
</script>