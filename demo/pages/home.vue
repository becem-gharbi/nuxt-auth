<template>
    <div class="m-4 flex flex-col items-center gap-4 justify-center">
        <UserCard></UserCard>
        <ChangePasswordCard></ChangePasswordCard>
        <SessionsCard></SessionsCard>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
    layout: "auth"
})
</script>