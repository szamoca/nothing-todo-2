<script lang="ts" setup>
import type { FetchError } from "ofetch";

// Fetch random user credentials on page load
const { data: randomUser } = await useFetch<User>("/api/users/random");

// Shared state for navbar refresh
const navbarRefreshKey = useState<number>("navbarRefreshKey", () => 0);

// Form state
const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
	if (!username.value || !password.value) {
		errorMessage.value = $t("Username and password are required");
		return;
	}

	isLoading.value = true;
	errorMessage.value = "";

	try {
		const response = await $fetch<AuthResponse>("/api/auth/login", {
			method: "POST",
			body: {
				username: username.value,
				password: password.value,
			},
		});

		// Save access token to cookie
		const tokenCookie = useCookie("jwt_access_token");
		tokenCookie.value = response.accessToken;

		// Trigger navbar refresh
		navbarRefreshKey.value++;

		// Redirect to home page
		await navigateTo("/");
	} catch (error) {
		// Display error message without refetching random user
		const fetchError = error as FetchError;
		errorMessage.value = fetchError?.data?.message || $t("Login failed. Please check your credentials.");
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<div class="login-page">
		<div class="login-container">
			<h1 class="login-title">{{ $t("Login") }}</h1>

			<!-- Random User Credentials Display -->
			<div v-if="randomUser" class="tile credentials-display">
				<p class="text-muted">{{ $t("Test credentials:") }}</p>
				<div class="credentials-info">
					<div>
						<strong>{{ $t("Username:") }}</strong>
						<span class="credential-value">{{ randomUser.username }}</span>
					</div>
					<div>
						<strong>{{ $t("Password:") }}</strong>
						<span class="credential-value">{{ randomUser.password }}</span>
					</div>
				</div>
			</div>

			<!-- Login Form -->
			<form @submit.prevent="handleLogin" class="login-form tile-offset">
				<div class="form-group">
					<label for="username">{{ $t("Username") }}</label>
					<input
						id="username"
						v-model="username"
						type="text"
						class="input"
						:placeholder="$t('Enter username')"
						:disabled="isLoading"
						required
					/>
				</div>

				<div class="form-group">
					<label for="password">{{ $t("Password") }}</label>
					<input
						id="password"
						v-model="password"
						type="password"
						class="input"
						:placeholder="$t('Enter password')"
						:disabled="isLoading"
						required
					/>
				</div>

				<p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>

				<button type="submit" class="btn-primary" :disabled="isLoading">
					{{ isLoading ? $t("Logging in...") : $t("Login") }}
				</button>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/__mixins' as *;

.login-page {
	@include container(600px);

	padding-block: var(--space-10);
}

.login-container {
	@include flex-column;

	gap: var(--space-6);
}

.login-title {
	font-size: var(--text-4xl);
	font-weight: 700;
	text-align: center;
	margin-bottom: var(--space-4);
}

.credentials-display {
	@include flex-column;

	gap: var(--space-4);
	background-color: var(--color-surface);
}

.credentials-info {
	@include flex-column;

	gap: var(--space-3);
	font-family: 'IBM Plex Mono', monospace;
	font-size: var(--text-sm);

	div {
		display: flex;
		gap: var(--space-3);
	}

	strong {
		min-width: 90px;
	}

	.credential-value {
		color: var(--color-primary);
		font-weight: 500;
	}
}

.login-form {
	@include flex-column;

	gap: var(--space-6);
}

.form-group {
	@include flex-column;

	gap: var(--space-2);

	label {
		font-weight: 500;
		font-size: var(--text-sm);
		color: var(--color-text);
	}
}
</style>
