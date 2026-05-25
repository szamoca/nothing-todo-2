import { FetchError } from "ofetch";

interface User {
  id: number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const userIdParam = getRouterParam(event, "userId");

  if (!userIdParam) {
    throw createError({
      statusCode: 400,
      statusText: "No user ID was provided",
    });
  }

  const userId = Number(userIdParam);

  const bearerToken = getHeader(event, "Authorization");

  if (!bearerToken) {
    throw createError({ statusCode: 400, statusText: "No token was passed" });
  }

  try {
    const user = (await $fetch("/api/auth/me", {
      headers: { Authorization: bearerToken },
    })) as User;

    if (user.id !== userId) {
      throw createError({ statusCode: 422, statusText: "User ID mismatch" });
    }

    const response = await $fetch(
      `${config.public.apiBaseUrl}/todos/user/${userId}`,
    );

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
