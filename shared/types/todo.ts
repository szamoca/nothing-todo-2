/**
 * Todo item returned by the DummyJSON todos endpoints.
 */
export interface Todo {
	id: number;
	todo: string;
	completed: boolean;
	userId: number;
}

/**
 * Paginated todo list response returned by GET /todos/user/{id}.
 */
export interface TodosListResponse {
	todos: Todo[];
	total: number;
	skip: number;
	limit: number;
}
