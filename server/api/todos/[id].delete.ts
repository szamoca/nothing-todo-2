export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const { userId } = await readBody(event);

	if (!(id && userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Todo ID and user ID are required",
		});
	}

	await requireAuthAndOwnership(event, userId);

	const response = await fetchFromApi<TodoDeleteResponse>(`/todos/${id}`, {
		method: "DELETE",
	});

	return response;
});
