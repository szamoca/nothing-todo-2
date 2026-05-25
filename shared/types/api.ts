/**
 * Generic shape for paginated list responses returned by the DummyJSON API.
 */
export interface PaginatedResponse {
	total: number;
	skip: number;
	limit: number;
}

/**
 * Generic helper type for paginated responses that expose items under a named collection key.
 */
export type NamedPaginatedResponse<TItem, TCollectionKey extends string> = PaginatedResponse & Record<TCollectionKey, TItem[]>;