<template>
    <section>
        <h1>Users management</h1>
        <ul>
            <li v-for="user of data">
                <p>{{ user }}</p>

                <form @submit.prevent="() => editUser({ id: user.id, data: user })">
                    <label for="suspend">Suspend</label>
                    <input id="suspend" type="checkbox" v-model="user.suspended">
                    <button>Edit</button>
                </form>

                <br>
            </li>
        </ul>
    </section>
</template>

<script setup>
const { listUsers, editUser } = useAuthAdmin()

const { data } = await useAsyncData(() => listUsers({
    select: {
        id: true
    }
}))
</script>