<script lang="ts" setup>
const refreshKey = useState<number>("navbarRefreshKey", () => 0);

const { data: user } = await useAsyncData("navbar-user", verifyAuthentication, {
    watch: [refreshKey],
});

async function logout() {
    useCookie("jwt_access_token").value = undefined;
    refreshKey.value++;
}

async function verifyAuthentication() {
    try {
        const token = useCookie("jwt_access_token");

        if (!token.value) {
            return false;
        }

        const result = await $fetch("/api/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!result.id) {
            return false;
        }

        return result;
    } catch (e) {
        console.warn(e);
    }
}
</script>

<template>
    <nav class="navbar" :key="refreshKey">
        <NuxtLink to="/">NOTHING todo</NuxtLink>

        <ul class="flex-between gap-6">
            <li>
                <NuxtLink to="/about">About</NuxtLink>
            </li>
            <div v-if="user" class="inline-flex gap-4">
                <li>{{ user.username }}</li>
                <li>
                    <button
                        @click="logout"
                        class="bg-amber-50 hover:bg-amber-200 rounded-full border border-cyan-950 px-4"
                    >
                        Logout
                    </button>
                </li>
            </div>
            <div v-else class="inline-flex gap-4">
                <li>
                    <NuxtLink to="/login">Login</NuxtLink>
                </li>
            </div>
        </ul>
    </nav>
</template>
