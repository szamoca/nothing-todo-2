export default defineEventHandler(async (event) => {
	const { username, password } = await readBody(event);

	if (!(username && password)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Username and password are required",
		});
	}

	const response = await fetchFromApi<AuthResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			username,
			password,
			expiresInMins: 3600,
		}),
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});

	return response;
});
