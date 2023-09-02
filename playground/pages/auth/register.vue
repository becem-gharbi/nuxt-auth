<template>
  <div>
    <h1>Register</h1>
    <button @click="handleRegister">
      Register
    </button>
    <button @click="requestEmailVerifyHandler">
      Request email verify
    </button>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest' })

const { register, requestEmailVerify } = useAuth()

async function handleRegister () {
  const { data, error } = await register({
    email: 'tester2@test.com',
    password: 'abc123',
    name: 'tester1'
  })
}

async function requestEmailVerifyHandler () {
  const { error } = await requestEmailVerify('tester2@test.com')
  // console.log(error.value?.data.message)
}
</script>
