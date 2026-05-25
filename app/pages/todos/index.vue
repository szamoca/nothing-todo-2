<script lang="ts" setup>
// Composables
const { userId, isAuthenticated, isLoading: userLoading } = useUser();
const { todos, isLoading: todosLoading, error, hasLoaded, fetchTodos, toggleTodo, deleteTodo } = useTodos();

// Local pending state per tile to prevent race conditions
const pendingTodoIds = ref<number[]>([]);

// Authentication check and redirect
onMounted(async () => {
	// Wait for user loading to complete
	if (userLoading.value) {
		await new Promise<void>((resolve) => {
			const unwatch = watch(userLoading, (loading) => {
				if (!loading) {
					unwatch();
					resolve();
				}
			});
		});
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated.value) {
		await navigateTo("/login");
		return;
	}

	// Fetch todos only if not already loaded and user is authenticated
	if (!hasLoaded.value && userId.value) {
		await fetchTodos(userId.value);
	}
});

async function handleToggleTodo(todoId: number) {
	if (!userId.value || pendingTodoIds.value.includes(todoId)) {
		return;
	}

	pendingTodoIds.value = [...pendingTodoIds.value, todoId];

	try {
		await toggleTodo(todoId, userId.value);
	} finally {
		pendingTodoIds.value = pendingTodoIds.value.filter((id) => id !== todoId);
	}
}

async function handleDeleteTodo(todoId: number) {
	if (!userId.value) {
		return;
	}
	await deleteTodo(todoId, userId.value);
}

function isTodoPending(todoId: number): boolean {
	return pendingTodoIds.value.includes(todoId);
}
</script>

<template>
	<div class="todos-page">
		<div class="container">
			<!-- Page Header -->
			<header class="page-header">
				<h1 class="page-title">{{ $t("My Todos") }}</h1>
			</header>

			<!-- Loading State -->
			<div
				v-if="todosLoading"
				class="state-message"
			>
				<div class="loading-spinner" />
				<p>{{ $t("Loading your todos...") }}</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="error"
				class="state-message state-error"
			>
				<p class="text-error">{{ $t(error) }}</p>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="hasLoaded && todos.length === 0"
				class="state-message"
			>
				<p class="text-muted">{{ $t("Good news! You don't have any todos for now.") }}</p>
			</div>

			<!-- Todos List -->
			<div
				v-else-if="hasLoaded && todos.length > 0"
				class="todos-grid"
			>
				<article
					v-for="todo in todos"
					:key="todo.id"
					class="todo-tile"
				>
					<p
						class="todo-text"
						:class="{ 'todo-completed': todo.completed }"
					>
						{{ todo.todo }}
					</p>

					<div class="todo-actions">
						<button
							type="button"
							:class="todo.completed ? 'btn-ghost' : 'btn-accent'"
							:disabled="todosLoading || isTodoPending(todo.id)"
							:aria-busy="isTodoPending(todo.id)"
							@click="handleToggleTodo(todo.id)"
						>
							{{ isTodoPending(todo.id) ? $t("Toggling...") : $t("Toggle Completion") }}
						</button>

						<button
							type="button"
							class="btn-danger"
							:disabled="todosLoading"
							@click="handleDeleteTodo(todo.id)"
						>
							{{ $t("Delete") }}
						</button>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.todos-page {
	min-height: 100vh;
	padding: var(--space-8) 0;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 var(--space-6);
}

// ========================================================================
// Page Header
// ========================================================================

.page-header {
	margin-bottom: var(--space-10);
}

.page-title {
	font-family: "Space Grotesk", sans-serif;
	font-size: var(--text-5xl);
	font-weight: 700;
	color: var(--color-text);
	letter-spacing: -0.02em;
	margin: 0;
}

// ========================================================================
// State Messages (Loading, Error, Empty)
// ========================================================================

.state-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--space-5);
	padding: var(--space-12) var(--space-6);
	text-align: center;

	p {
		font-family: "IBM Plex Mono", monospace;
		font-size: var(--text-lg);
		margin: 0;
	}
}

.state-error {
	p {
		font-weight: 500;
	}
}

.loading-spinner {
	width: 40px;
	height: 40px;
	border: 3px solid var(--ghost-white-dark);
	border-top-color: var(--color-primary);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

// ========================================================================
// Todos Grid - Asymmetric Layout
// ========================================================================

.todos-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: var(--space-6);

	@media (width >= 768px) {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-7);
	}
}

// ========================================================================
// Todo Tile - Modular Card Design
// ========================================================================

.todo-tile {
	background-color: var(--ghost-white);
	border: 1px solid var(--ghost-white-dark);
	border-radius: var(--radius-md);
	padding: var(--space-6);
	transition: border-color 0.2s ease;
	aspect-ratio: 1 / 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: var(--space-4);

	&:hover {
		border-color: var(--color-primary-light);
	}
}

// ========================================================================
// Todo Text
// ========================================================================

.todo-text {
	font-family: "IBM Plex Mono", monospace;
	font-size: var(--text-base);
	line-height: 1.6;
	color: var(--color-text);
	margin: 0;
	overflow-wrap: break-word;

	&.todo-completed {
		font-weight: 700;
		text-decoration: line-through;
		text-decoration-color: var(--color-primary);
		text-decoration-thickness: 2px;
	}
}

// ========================================================================
// Todo Actions (Button Container)
// ========================================================================

.todo-actions {
	display: flex;
	gap: var(--space-3);
	margin-top: auto;

	button {
		flex: 1;
		font-size: var(--text-sm);
		padding: var(--space-3) var(--space-4);
	}
}
</style>
