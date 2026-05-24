import { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const bearerToken = getHeader(event, "Authorization");

  if (!bearerToken) {
    throw createError({ statusCode: 400, statusText: "No token was passed" });
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/auth/me`, {
      method: "GET",
      headers: { Authorization: bearerToken },
      credentials: "include",
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
