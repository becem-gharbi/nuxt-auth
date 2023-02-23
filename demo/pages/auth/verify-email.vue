<template>
    <NuxtLayout>
        <n-result v-if="$route.query.error" status="error" title="Failed to verify email"
            :description="$route.query.error.toString()">
            <template #footer>
                <NuxtLink to="/auth/login" class="no-underline">
                    <n-button type="primary">Go back to login</n-button>
                </NuxtLink>
            </template>
        </n-result>

        <n-result v-else status="success" title="Your email is confirmed"
            description="Registration successfully completed">
            <template #footer>
                <NuxtLink to="/auth/login" class="no-underline">
                    <n-button type="primary">Go back to login</n-button>
                </NuxtLink>
            </template>
        </n-result>
    </NuxtLayout>
</template>

<script setup>
definePageMeta({
    layout: "auth",
})
</script>