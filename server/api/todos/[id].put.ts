import { FetchError } from "ofetch";

interface User {
  id: number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const id = getRouterParam(event, "id");

  const { userId, completed } = await readBody(event);

  if (!(id && userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const bearerToken = getHeader(event, "Authorization");

  if (!bearerToken) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const user = (await $fetch("/api/auth/me", {
      headers: { Authorization: bearerToken },
    })) as User;

    if (user.id !== userId) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const response = await $fetch(`${config.public.apiBaseUrl}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        completed,
      }),
    });

    return response;
  } catch (error) {
    if (error instanceof FetchError) {
      throw createError({
        statusCode: error.statusCode,
        statusText: error.statusText,
      });
    }
    throw error;
  }
});
