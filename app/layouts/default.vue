<script lang="ts" setup>
const { user, isLoading, fetchUser, logout } = useUser();

// Fetch user on mount (non-blocking)
onMounted(() => {
	fetchUser();
});
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
