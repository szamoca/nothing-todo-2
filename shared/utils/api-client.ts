import { handleApiError } from "./api-error-handler";

/**
 * Gets the API base URL from runtime configuration.
 *
 * This utility provides a centralized way to access the external API base URL
 * configured via the NUXT_PUBLIC_API_BASE_URL environment variable.
 *
 * @returns {string} The base URL for the external API (e.g., https://dummyjson.com)
 *
 * @example
 * ```ts
 * const baseUrl = getApiBaseUrl();
 * // Returns: "https://dummyjson.com"
 * ```
 */
export function getApiBaseUrl(): string {
	const config = useRuntimeConfig();
	return config.public.apiBaseUrl;
}

/**
 * Wrapper around $fetch that constructs full URLs and handles errors consistently.
 *
 * This utility simplifies API calls by:
 * - Automatically prepending the base URL from runtime config
 * - Catching and converting FetchError instances to Nuxt errors
 * - Providing proper TypeScript typing for responses
 *
 * @template T - The expected response type
 * @param endpoint - The API endpoint path (e.g., "/auth/me")
 * @param options - Optional fetch configuration (method, headers, body, etc.)
 * @returns {Promise<T>} The typed API response
 * @throws {H3Error} Throws Nuxt error with proper status code on failure
 *
 * @example
 * ```ts
 * // GET request
 * const user = await fetchFromApi<User>('/auth/me', {
 *   headers: { Authorization: 'Bearer token' }
 * });
 *
 * // POST request
 * const todo = await fetchFromApi<Todo>('/todos/add', {
 *   method: 'POST',
 *   body: { todo: 'New task', completed: false, userId: 1 }
 * });
 * ```
 */
export async function fetchFromApi<T>(endpoint: string, options?: Parameters<typeof $fetch>[1]): Promise<T> {
	const baseUrl = getApiBaseUrl();
	const fullUrl = `${baseUrl}${endpoint}`;

	try {
		return (await $fetch<T>(fullUrl, options)) as T;
	} catch (error) {
		return handleApiError(error);
	}
}
