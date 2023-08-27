<template>
    <div>
        <h1>Reset password</h1>


        <form @submit.prevent="handleResetPassword">
            <input placeholder="new password" v-model="password" autocomplete="new-password">
            <button type="submit">Reset password</button>
        </form>

    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { resetPassword } = useAuth()

const password = ref()

async function handleResetPassword() {
    const { error } = await resetPassword(password.value)
    console.log(error.value?.data.message)
}

</script>