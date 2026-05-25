import { defineEventHandler, readBody, createError } from "h3";
import type { Todo } from "../../../shared/types/todo";
import { fetchFromApi } from "../../../shared/utils/api-client";
import { requireAuthAndOwnership } from "../../../shared/utils/auth";

export default defineEventHandler(async (event) => {
	const { todo, userId } = await readBody(event);

	if (!(todo && userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Todo must be specified",
		});
	}

	await requireAuthAndOwnership(event, userId);

	const response = await fetchFromApi<Todo>("/todos/add", {
		method: "POST",
		body: JSON.stringify({
			todo,
			userId,
			completed: false,
		}),
	});

	return response;
});
