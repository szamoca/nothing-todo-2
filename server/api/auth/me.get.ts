import { defineEventHandler } from "h3";
import type { User } from "../../../shared/types/user";
import { fetchFromApi } from "../../../shared/utils/api-client";
import { requireAuth } from "../../../shared/utils/auth";

export default defineEventHandler(async (event) => {
	const bearerToken = await requireAuth(event);

	const response = await fetchFromApi<User>("/auth/me", {
		method: "GET",
		headers: { Authorization: bearerToken },
		credentials: "include",
	});

	return response;
});
