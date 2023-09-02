<template>
  <div>
    <h1>Reset password</h1>
    <button @click="handleResetPassword">
      Reset password
    </button>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest' })

const { resetPassword } = useAuth()

async function handleResetPassword () {
  const { error } = await resetPassword('efg123')
  // console.log(error.value?.data.message)
}

</script>
