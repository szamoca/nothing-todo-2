<script lang="ts" setup>
const { user, isLoading, fetchUser, logout } = useUser();

// Watch for token changes to refresh user state
const token = useCookie("jwt_access_token");
watch(
	() => token.value,
	(newToken) => {
		if (newToken) {
			// Token was set (login), fetch user data
			fetchUser();
		}
	},
	{ immediate: true },
);
</script>

<template>
	<NavigationBar
		:user="user"
		:is-loading="isLoading"
		:on-logout="logout"
	/>
	<div class="container">
		<slot />
	</div>
</template>
