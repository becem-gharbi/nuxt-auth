<template>
    <NuxtLayout>
        <n-result v-if="$route.query.error" status="error" title="Failed to login"
            :description="$route.query.error.toString()">
            <template #footer>
                <NuxtLink to="/auth/login" class="no-underline">
                    <n-button type="primary">Go back to login</n-button>
                </NuxtLink>
            </template>
        </n-result>

        <n-spin v-else size="large"></n-spin>
    </NuxtLayout>
</template>

<script setup>
definePageMeta({
    layout: "auth",
})
</script>