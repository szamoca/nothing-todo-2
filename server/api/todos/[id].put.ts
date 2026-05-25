import { defineEventHandler, readBody, createError, getRouterParam } from "h3";
import type { Todo } from "../../../shared/types/todo";
import { fetchFromApi } from "../../../shared/utils/api-client";
import { requireAuthAndOwnership } from "../../../shared/utils/auth";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const { userId, completed } = await readBody(event);

	if (!(id && userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Todo ID and user ID are required",
		});
	}

	await requireAuthAndOwnership(event, userId);

	const response = await fetchFromApi<Todo>(`/todos/${id}`, {
		method: "PUT",
		body: JSON.stringify({
			completed,
		}),
	});

	return response;
});
