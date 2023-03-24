<template>
    <section>
        <h1>Users management</h1>
        <p>{{ data }}</p>
    </section>
</template>

<script setup>
const { listUsers } = useAuthAdmin()

const { data } = await useAsyncData(() => listUsers({}))
</script>