import { FetchError } from "ofetch";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  // TODO: Get the count of all users by API call
  const userId = Math.floor(Math.random() * 208) + 1;

  try {
    const response = await $fetch(
      `${config.public.apiBaseUrl}/users/${userId}`,
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
