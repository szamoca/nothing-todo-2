<script lang="ts" setup>
interface Props {
	user: User | null;
	isLoading?: boolean;
	onLogout: () => void | Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
	isLoading: false,
});

// Handle logout click
async function handleLogout() {
	await props.onLogout();
}
</script>

<template>
	<nav class="navbar">
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
					<button
						@click="handleLogout"
						class="logout-btn auth-link"
						:disabled="isLoading"
					>
						{{ $t("Logout") }}
					</button>
				</li>
				<li class="username">
					{{ isLoading ? $t("Loading...") : user.username }}
				</li>
			</template>
			<template v-else>
				<li>
					<NuxtLink
						to="/login"
						class="auth-link"
					>
						{{ $t("Login") }}
					</NuxtLink>
				</li>
			</template>
		</ul>
	</nav>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.navbar {
	background-color: var(--espresso);

	a,
	.logout-btn {
		@include link-nav;

		color: var(--ghost-white);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: inherit;
		font-family: inherit;
	}

	.auth-link {
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
