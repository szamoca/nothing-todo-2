import type { FetchError } from "ofetch";
import { createError } from "h3";

/**
 * Handles API errors by converting FetchError instances to Nuxt errors
 * and re-throwing other errors as-is.
 *
 * This utility provides consistent error handling across all API endpoints,
 * ensuring that HTTP errors from the external API are properly propagated
 * with their status codes and messages.
 *
 * @param error - The error caught from an API call
 * @throws {H3Error} Always throws - either a converted FetchError or the original error
 * @returns {never} This function never returns normally
 *
 * @example
 * ```ts
 * try {
 *   const data = await $fetch('/api/endpoint');
 * } catch (error) {
 *   handleApiError(error);
 * }
 * ```
 */
export function handleApiError(error: unknown): never {
	if (error instanceof Error && "statusCode" in error) {
		const fetchError = error as FetchError;
		throw createError({
			statusCode: fetchError.statusCode,
			statusMessage: fetchError.statusMessage,
		});
	}
	throw error;
}