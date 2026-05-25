import type { H3Event } from "h3";
import { getHeader, createError } from "h3";
import type { User } from "../types/user";
import { fetchFromApi } from "./api-client";
import { AUTH_ERRORS } from "./errors";

/**
 * Extracts and validates the Authorization header from an H3 event.
 *
 * This utility ensures that a valid Bearer token is present in the request headers.
 * It's used as the first step in authentication flows to extract the token.
 *
 * @param event - The H3 event object from the request
 * @returns {Promise<string>} The Bearer token (including "Bearer " prefix)
 * @throws {H3Error} 401 error if no Authorization header is present
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const token = await requireAuth(event);
 *   // Use token for API calls
 * });
 * ```
 */
export async function requireAuth(event: H3Event): Promise<string> {
	const bearerToken = getHeader(event, "Authorization");

	if (!bearerToken) {
		throw createError(AUTH_ERRORS.NO_TOKEN);
	}

	return bearerToken;
}

/**
 * Validates authentication and verifies resource ownership.
 *
 * This utility performs a two-step validation:
 * 1. Extracts and validates the Authorization token
 * 2. Fetches the authenticated user and verifies they own the resource
 *
 * This is commonly used in endpoints that modify user-specific resources
 * (e.g., updating or deleting a user's todos) to ensure users can only
 * access their own data.
 *
 * @param event - The H3 event object from the request
 * @param userId - The user ID that should own the resource
 * @returns {Promise<User>} The authenticated user object if ownership is valid
 * @throws {H3Error} 401 error if authentication fails, 403 error if user doesn't own the resource
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const userId = Number(event.context.params?.userId);
 *   const user = await requireAuthAndOwnership(event, userId);
 *   // User is authenticated and owns the resource
 * });
 * ```
 */
export async function requireAuthAndOwnership(event: H3Event, userId: number): Promise<User> {
	const bearerToken = await requireAuth(event);

	try {
		const user = await fetchFromApi<User>("/auth/me", {
			method: "GET",
			headers: { Authorization: bearerToken },
			credentials: "include",
		});

		if (user.id !== userId) {
			throw createError(AUTH_ERRORS.FORBIDDEN);
		}

		return user;
	} catch (error) {
		// If fetchFromApi throws, it's already a proper H3Error
		// If it's a different error, convert it
		if (error && typeof error === "object" && "statusCode" in error) {
			throw error;
		}
		throw createError(AUTH_ERRORS.INVALID_TOKEN);
	}
}
