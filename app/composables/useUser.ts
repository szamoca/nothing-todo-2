/**
 * Global user state management composable.
 *
 * Provides SSR-safe reactive user state with authentication helpers.
 * Auto-initializes on first call if a valid JWT token exists.
 *
 * @example
 * ```ts
 * const { user, isAuthenticated, isLoading, fetchUser, logout } = useUser();
 *
 * // Check if user is logged in
 * if (isAuthenticated.value) {
 *   console.log('User:', user.value?.username);
 * }
 *
 * // Manually refresh user data
 * await fetchUser();
 *
 * // Logout
 * await logout();
 * ```
 */
export function useUser() {
	// SSR-safe global state using useState
	const user = useState<User | null>("user", () => null);
	const isLoading = useState<boolean>("user-loading", () => false);

	// Computed reactive properties
	const isAuthenticated = computed(() => user.value !== null);
	const userId = computed(() => user.value?.id ?? null);

	/**
	 * Fetches the current user from the API using the JWT token.
	 *
	 * - Checks if jwt_access_token cookie exists
	 * - Calls /api/auth/me to validate token and get user data
	 * - Updates global user state on success
	 * - Clears state on authentication errors (401/403)
	 * - Handles errors gracefully without throwing
	 */
	async function fetchUser(): Promise<void> {
		const token = useCookie("jwt_access_token");

		// No token means not authenticated
		if (!token.value) {
			user.value = null;
			isLoading.value = false;
			return;
		}

		isLoading.value = true;

		try {
			const result = await $fetch<User>("/api/auth/me", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.value}` },
			});

			// Validate we got a proper user object
			if (result && result.id) {
				user.value = result;
			} else {
				// Invalid response, clear state
				user.value = null;
				token.value = null;
			}
		} catch (error: unknown) {
			// Clear auth state on authentication failures
			if (error && typeof error === "object" && "statusCode" in error) {
				const statusCode = (error as { statusCode: number }).statusCode;
				if (statusCode === 401 || statusCode === 403) {
					user.value = null;
					token.value = null;
				}
			} else {
				// Other errors (network, etc.) - just clear user state
				user.value = null;
			}

			// Log warning but don't throw - let caller handle via state
			console.warn("Failed to fetch user:", error);
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * Logs out the current user.
	 *
	 * - Clears the jwt_access_token cookie
	 * - Clears user state
	 * - Redirects to login page
	 */
	async function logout(): Promise<void> {
		// Clear cookie
		const token = useCookie("jwt_access_token");
		token.value = null;

		// Clear state
		user.value = null;

		// Redirect to login
		await navigateTo("/login");
	}

	// Auto-initialize on first call if token exists and user not loaded
	const token = useCookie("jwt_access_token");
	if (token.value && !user.value && !isLoading.value) {
		fetchUser();
	}

	return {
		user: readonly(user),
		isAuthenticated: readonly(isAuthenticated),
		isLoading: readonly(isLoading),
		userId: readonly(userId),
		fetchUser,
		logout,
	};
}
