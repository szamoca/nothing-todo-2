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

/**
 * Response returned by DELETE /todos/{id}.
 * DummyJSON returns the deleted todo with additional metadata.
 */
export interface TodoDeleteResponse extends Todo {
	isDeleted: boolean;
	deletedOn: string; // ISO 8601 timestamp
}
