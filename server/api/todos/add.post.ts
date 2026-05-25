import { FetchError } from "ofetch";

interface User {
  id: number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const { todo, userId } = await readBody(event);

  if (!(todo && userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Todo must be specified",
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

    const response = await $fetch(`${config.public.apiBaseUrl}/todos/add`, {
      method: "POST",
      body: JSON.stringify({
        todo,
        userId,
        completed: false,
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
