<script lang="ts" setup>
const refreshKey = useState<number>("navbarRefreshKey", () => 0);

const { data: user } = await useAsyncData("navbar-user", verifyAuthentication, {
    watch: [refreshKey],
});

async function logout() {
	useCookie("jwt_access_token").value = null;
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
        	headers: { Authorization: `Bearer ${token.value}` },
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
        <NuxtLink to="/">{{ $t("NOTHING todo") }}</NuxtLink>

        <ul class="flex-between gap-6">
        	<li>
        		<NuxtLink to="/about">{{ $t("About") }}</NuxtLink>
        	</li>
        	<template v-if="user">
        		<li>
        			<NuxtLink to="/todos">{{ $t("My Todos") }}</NuxtLink>
        		</li>
        		<li>
        			<NuxtLink to="/todos/add">{{ $t("Create a New Todo") }}</NuxtLink>
        		</li>
        		<li>
        			<button @click="logout" class="logout-btn">
        				{{ $t("Logout") }}
        			</button>
        		</li>
        		<li class="username">{{ user.username }}</li>
        	</template>
        	<template v-else>
        		<li>
        			<NuxtLink to="/login">{{ $t("Login") }}</NuxtLink>
        		</li>
        	</template>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/__mixins' as *;

.navbar {
	a,
	.logout-btn {
		@include link-nav;
		
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: inherit;
		font-family: inherit;
	}
	
	.logout-btn {
		&:hover {
			text-decoration-color: var(--burnt-peach);
		}
	}
	
	.username {
		font-weight: 600;
		color: var(--color-primary);
	}
	
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
}
</style>
