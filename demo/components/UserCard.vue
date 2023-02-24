<template>
    <n-card v-if="user">
        <template #header>
            <div class="flex items-center gap-3">
                <n-avatar round :src="pictureUrl" />
                <n-text>{{ "Welcome " + user.name }}</n-text>
            </div>
        </template>

        <div class="flex flex-col gap-2">
            <n-text>{{ 'Provider: ' + user.provider }}</n-text>
            <n-text>{{ 'Email: ' + user.email }}</n-text>
            <n-text>{{ 'Role: ' + user.role }}</n-text>
            <n-text>{{ 'Verified: ' + user.verified }}</n-text>
            <n-text>{{ 'Updated at: ' + user.updatedAt }}</n-text>
            <n-text>{{ 'Created at: ' + user.createdAt }}</n-text>
        </div>

        <template #footer>
            <n-button class="float-right" @click="logout" type="primary">Logout</n-button>
        </template>
    </n-card>
</template>

<script setup lang="ts">
const { useUser } = useAuthSession()
const { logout } = useAuth()

const user = useUser()

const pictureUrl = computed(() => user.value?.picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png')
</script>