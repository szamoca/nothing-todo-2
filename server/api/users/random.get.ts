export default defineEventHandler(async () => {
	// TODO: Get the count of all users by API call
	const userId = Math.floor(Math.random() * 208) + 1;

	const response = await fetchFromApi<User>(`/users/${userId}`);

	return response;
});
