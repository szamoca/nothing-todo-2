/**
 * Standard error definitions for consistent error handling across the application.
 * These constants provide reusable error configurations with proper HTTP status codes.
 */

/**
 * Authentication-related error definitions.
 * Used for token validation and authorization checks.
 */
export const AUTH_ERRORS = {
	/**
	 * Error thrown when no Authorization header is provided.
	 */
	NO_TOKEN: {
		statusCode: 401,
		statusMessage: "Unauthorized",
		message: "No authorization token provided",
	},
	/**
	 * Error thrown when the provided token is invalid or expired.
	 */
	INVALID_TOKEN: {
		statusCode: 401,
		statusMessage: "Unauthorized",
		message: "Invalid or expired token",
	},
	/**
	 * Error thrown when a user attempts to access a resource they don't own.
	 */
	FORBIDDEN: {
		statusCode: 403,
		statusMessage: "Forbidden",
		message: "You do not have permission to access this resource",
	},
} as const;
