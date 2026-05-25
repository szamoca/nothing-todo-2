export default defineEventHandler(async (event) => {
	const bearerToken = await requireAuth(event);

	const response = await fetchFromApi<User>("/auth/me", {
		method: "GET",
		headers: { Authorization: bearerToken },
		credentials: "include",
	});

	return response;
});
