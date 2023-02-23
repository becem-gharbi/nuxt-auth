<template>
    <NuxtLayout>
        <n-result v-if="success" status="success" title="Done"
            description="We've sent you a secure link to reset your password">
            <template #footer>
                <NuxtLink to="/auth/login" class="no-underline">
                    <n-button type="primary">Go back to login</n-button>
                </NuxtLink>
            </template>
        </n-result>

        <n-card v-else>
            <n-form ref="formRef" :rules="rules" :model="model" @submit.prevent="onSubmit(handleSubmit)">
                <n-form-item label="Email" path="email" :show-require-mark="false">
                    <n-input v-model:value="model.email"></n-input>
                </n-form-item>

                <n-button block attr-type="submit" :loading="pending" type="primary">
                    <template #icon>
                        <NaiveIcon name="carbon:reset"></NaiveIcon>
                    </template>
                    Reset password
                </n-button>
            </n-form>
        </n-card>

        <n-card v-if="!success" class="text-center">
            No need for that?
            <NuxtLink to="/auth/login" class="no-underline">
                <n-text type="primary">Go back</n-text>
            </NuxtLink>
        </n-card>
    </NuxtLayout>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "guest",
    layout: "auth"
})

const { formRef, rules, pending, onSubmit } = useNaiveForm()
const { requestPasswordReset } = useAuth()

const success = ref(false)

const model = ref({
    email: "",
});

rules.value = {
    email: [
        {
            required: true,
            message: "Please input your email",
            trigger: "input",
        },
        {
            type: "email",
            message: "Please enter a valid email",
            trigger: "blur"
        },
    ],
}

async function handleSubmit() {
    const { error } = await requestPasswordReset(model.value.email)

    if (error.value) {
        console.warn(error.value.data.errors[0].message)
    }

    else {
        success.value = true
    }
}
</script>