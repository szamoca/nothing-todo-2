import { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const { username, password } = await readBody(event);

  if (!(username && password)) {
    throw createError({
      statusCode: 400,
      message: "Username and password are required",
    });
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: { "Content-Type": "application/json" },
      expiresInMins: 3600,
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
