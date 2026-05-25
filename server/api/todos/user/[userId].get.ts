export default defineEventHandler(async (event) => {
	const userIdParam = getRouterParam(event, "userId");

	if (!userIdParam) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "No user ID was provided",
		});
	}

	const userId = Number(userIdParam);

	await requireAuthAndOwnership(event, userId);

	const response = await fetchFromApi<TodosListResponse>(`/todos/user/${userId}`);

	return response;
});
