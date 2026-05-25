/**
 * Global todos state management composable.
 *
 * Provides SSR-safe reactive todos state with CRUD operations.
 * Uses local state as source of truth since DummyJSON doesn't persist changes.
 *
 * @example
 * ```ts
 * const { todos, isLoading, error, fetchTodos, addTodo } = useTodos();
 *
 * // Fetch todos for current user
 * await fetchTodos(userId);
 *
 * // Add a new todo
 * const success = await addTodo(userId, "Buy groceries");
 *
 * // Access todos list
 * console.log(todos.value);
 * ```
 */
export function useTodos() {
	// SSR-safe global state using useState
	const todos = useState<Todo[]>("todos", () => []);
	const isLoading = useState<boolean>("todos-loading", () => false);
	const error = useState<string | null>("todos-error", () => null);
	const hasLoaded = useState<boolean>("todos-has-loaded", () => false);

	// Pagination metadata
	const total = useState<number>("todos-total", () => 0);
	const skip = useState<number>("todos-skip", () => 0);
	const limit = useState<number>("todos-limit", () => 30);

	/**
	 * Fetches todos for a specific user from the API.
	 *
	 * - Calls /api/todos/user/{userId} endpoint
	 * - Updates global todos state with returned data
	 * - Updates pagination metadata (total, skip, limit)
	 * - Handles errors gracefully without throwing
	 *
	 * @param userId - The user ID to fetch todos for
	 */
	async function fetchTodos(userId: number): Promise<void> {
		isLoading.value = true;
		error.value = null;

		try {
			const token = useCookie("jwt_access_token");

			const headers: Record<string, string> = {};
			if (token.value) {
				headers.Authorization = `Bearer ${token.value}`;
			}

			const response = await $fetch<TodosListResponse>(`/api/todos/user/${userId}`, {
				method: "GET",
				headers,
			});

			// Update state with API response
			todos.value = response.todos;
			total.value = response.total;
			skip.value = response.skip;
			limit.value = response.limit;

			// Mark as loaded after successful fetch
			hasLoaded.value = true;
		} catch (err: unknown) {
			// Set user-friendly error message
			error.value = "Failed to load todos. Please try again.";

			// Log warning but don't throw - let caller handle via state
			console.warn("Failed to fetch todos:", err);
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * Adds a new todo for a specific user.
	 *
	 * - Calls /api/todos/add endpoint with todo text
	 * - Waits for API response
	 * - Prepends returned todo to local state for visibility
	 * - Handles errors gracefully without throwing
	 *
	 * @param userId - The user ID to add the todo for
	 * @param todoText - The todo text/description
	 * @returns Promise<boolean> - true if successful, false if failed
	 */
	async function addTodo(userId: number, todoText: string): Promise<boolean> {
		isLoading.value = true;
		error.value = null;

		try {
			const token = useCookie("jwt_access_token");

			const headers: Record<string, string> = {};
			if (token.value) {
				headers.Authorization = `Bearer ${token.value}`;
			}

			const response = await $fetch<Todo>("/api/todos/add", {
				method: "POST",
				headers,
				body: {
					todo: todoText,
					userId,
				},
			});

			// Use negative timestamp as local ID to identify locally-created todos
			const localTodo: Todo = {
				...response,
				id: -Date.now(),
			};

			// Add the returned todo to the beginning of the list for visibility
			todos.value = [localTodo, ...todos.value];

			// Update total count
			total.value += 1;

			return true;
		} catch (err: unknown) {
			// Set user-friendly error message
			error.value = "Failed to add todo. Please try again.";

			// Log warning but don't throw - let caller handle via state
			console.warn("Failed to add todo:", err);

			return false;
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * Toggles the completion status of a todo.
	 *
	 * - Optimistically updates local state for immediate feedback
	 * - Reverts the optimistic update if the API call fails
	 * - Handles errors gracefully without throwing
	 *
	 * @param todoId - The todo ID to toggle
	 * @param userId - The user ID that owns the todo
	 * @returns Promise<boolean> - true if successful, false if failed
	 */
	async function toggleTodo(todoId: number, userId: number): Promise<boolean> {
		isLoading.value = true;
		error.value = null;

		const todoIndex = todos.value.findIndex((todo) => todo.id === todoId);
		if (todoIndex === -1) {
			error.value = "Todo not found";
			isLoading.value = false;
			return false;
		}

		const todo = todos.value[todoIndex];
		if (!todo) {
			error.value = "Todo not found";
			isLoading.value = false;
			return false;
		}

		const originalCompleted = todo.completed;
		todo.completed = !originalCompleted;

		// If it's a local todo (negative ID), skip API call
		if (todoId < 0) {
			isLoading.value = false;
			return true;
		}

		try {
			const token = useCookie("jwt_access_token");

			const headers: Record<string, string> = {};
			if (token.value) {
				headers.Authorization = `Bearer ${token.value}`;
			}

			const response = await $fetch<Todo>(`/api/todos/${todoId}`, {
				method: "PUT",
				headers,
				body: {
					userId,
					completed: !originalCompleted,
				},
			});

			todos.value[todoIndex] = response;

			return true;
		} catch (err: unknown) {
			todo.completed = originalCompleted;
			error.value = "Failed to update todo. Please try again.";
			console.warn("Failed to toggle todo:", err);
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * Deletes a todo.
	 *
	 * TODO: Implement delete functionality
	 * - Call /api/todos/{id} DELETE endpoint
	 * - Remove from local state
	 * - Handle errors gracefully
	 *
	 * @param id - The todo ID to delete
	 */
	// async function deleteTodo(id: number): Promise<boolean> {
	// 	// Implementation pending
	// }

	/**
	 * Clears all todos from state.
	 *
	 * - Resets todos array to empty
	 * - Resets pagination metadata
	 * - Clears error state
	 * - Called on user logout
	 */
	function clearTodos(): void {
		todos.value = [];
		total.value = 0;
		skip.value = 0;
		limit.value = 30;
		error.value = null;
		isLoading.value = false;
		hasLoaded.value = false;
	}

	return {
		todos: readonly(todos),
		isLoading: readonly(isLoading),
		error: readonly(error),
		hasLoaded: readonly(hasLoaded),
		total: readonly(total),
		skip: readonly(skip),
		limit: readonly(limit),
		fetchTodos,
		addTodo,
		toggleTodo,
		clearTodos,
	};
}
