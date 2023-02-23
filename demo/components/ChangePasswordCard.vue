<template>
    <n-card title="Change password">
        <n-form ref="formRef" :model="model" :rules="rules">
            <n-form-item label="Current password" path="currentPassword">
                <n-input v-model:value="model.currentPassword" type="password"></n-input>
            </n-form-item>
            <n-form-item label="New password" path="newPassword">
                <n-input v-model:value="model.newPassword" type="password"></n-input>
            </n-form-item>
        </n-form>

        <template #footer>
            <n-button type="warning" @click="onSubmit(handleChangePassword)" :loading="pending" class="float-right">
                Change password
            </n-button>
        </template>
    </n-card>
</template>

<script setup lang="ts">
const { changePassword } = useAuth()

const message = useMessage()

const { formRef, onSubmit, pending, rules, apiErrors } = useNaiveForm()

const model = ref({
    currentPassword: "",
    newPassword: ""
})

apiErrors.value = {
    wrongPassword: false
}

rules.value = {
    currentPassword: [
        {
            required: true,
            message: "Please enter your password",
            trigger: "blur"
        },
        {
            validator: () => !apiErrors.value.wrongPassword,
            message: "Wrong password",
            trigger: "input"
        }
    ],
    newPassword: [
        {
            required: true,
            message: "Please enter your new password",
            trigger: "input"
        },
    ]
}

async function handleChangePassword() {
    await changePassword({
        currentPassword: model.value.currentPassword,
        newPassword: model.value.newPassword
    }).then(() => {
        message.success("Your password is changed")
    }).catch((e) => {
        apiErrors.value.wrongPassword = e.data.message === "wrong-password"
    })
}</script>