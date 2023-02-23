<template>
    <n-card title="Active sessions">
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Browser</th>
                    <th>Device</th>
                    <th>OS</th>
                    <th>Updated</th>
                    <th>Created</th>
                    <th>Revoke</th>
                </tr>
            </thead>
            <tbody v-if="data">
                <tr v-for="session of data">
                    <td class="flex justify-between">
                        <n-text>{{ session.id }}</n-text>
                        <n-tag v-if="session.active" type="success">
                            Active
                        </n-tag>
                    </td>
                    <td>{{ UAParser(session.ua || undefined).browser.name }}</td>
                    <td>{{ UAParser(session.ua || undefined).device.model }}</td>
                    <td>{{ UAParser(session.ua || undefined).os.name }}</td>
                    <td>{{ dayjs(session.updatedAt).fromNow() }}</td>
                    <td>{{ dayjs(session.createdAt).fromNow() }}</td>
                    <td> <n-button text @click="revokeSession(session.id)" style="font-size:20px">
                            <NaiveIcon name="heroicons:trash"></NaiveIcon>
                        </n-button></td>
                </tr>
            </tbody>
        </n-table>

        <template #footer>
            <div class="flex gap-4 float-right flex-wrap">
                <n-button v-if="data" @click="refresh()">Refresh</n-button>
                <n-button @click="revokeAllSessions()" type="error">Revoke all</n-button>
            </div>
        </template>
    </n-card>
</template>

<script setup lang="ts">
import { UAParser } from "ua-parser-js"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const { getAllSessions, revokeAllSessions, revokeSession } = useAuthSession()

const { data, refresh } = useAsyncData(getAllSessions, { server: false })
</script>