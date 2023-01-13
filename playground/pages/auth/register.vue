<template>
    <div>
        <h1>Register</h1>
        <button @click="handleRegister">Register</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { register } = useDirectusAuth()

async function handleRegister() {
    const { data, error } = await register({
        email: "becem.gharbi96@gmail.com",
        password: "123456"
    })

    console.log(data.value)
    console.log(error.value.data.errors[0].message)
}
</script>