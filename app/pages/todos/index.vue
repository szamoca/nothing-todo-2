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
				<TodoCard
					v-for="todo in todos"
					:key="todo.id"
					:todo="todo"
					:pending="isTodoPending(todo.id)"
					@toggle="handleToggleTodo(todo.id)"
					@delete="handleDeleteTodo(todo.id)"
				/>
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
</style>
