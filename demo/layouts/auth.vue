<template>
    <div class="min-h-screen flex flex-col items-center justify-center w-full">
        <div class="w-max grid grid-cols-1 gap-4">
            <slot></slot>
        </div>

        <NuxtLink class="my-4 no-underline" to="https://github.com/becem-gharbi/nuxt-auth" target="_blank">
            <n-text>
                <NaiveIcon name="codicon:github"></NaiveIcon>
                View source code
            </n-text>
        </NuxtLink>
    </div>
</template>