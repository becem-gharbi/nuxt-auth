<template>
    <div>
        <h1>Reset password</h1>
        <button @click="handleResetPassword">Reset password</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { resetPassword } = useAuth()

async function handleResetPassword() {
    await resetPassword({ password: "123456" })
}

</script>