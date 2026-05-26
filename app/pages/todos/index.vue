<script lang="ts" setup>
// Composables
const { userId, isAuthenticated, isLoading: userLoading } = useUser();
const { todos, isLoading: todosLoading, error, hasLoaded, loadedUserId, fetchTodos, clearTodos, toggleTodo, deleteTodo } = useTodos();

// Local pending state per tile to prevent race conditions
const pendingTodoIds = ref<number[]>([]);

// Authentication check and reactive todo loading
watch(
	[userLoading, isAuthenticated, userId, loadedUserId],
	async ([loading, authenticated, currentUserId, currentLoadedUserId]) => {
		if (loading) {
			return;
		}

		if (!authenticated) {
			clearTodos();
			await navigateTo("/login");
			return;
		}

		if (!currentUserId) {
			return;
		}

		if (currentLoadedUserId !== null && currentLoadedUserId !== currentUserId) {
			clearTodos();
		}

		if (!hasLoaded.value) {
			await fetchTodos(currentUserId);
		}
	},
	{ immediate: true },
);

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
			<PageHeader
				:title="$t('My Todos')"
				align="left"
			/>

			<!-- Loading State -->
			<StateMessage
				v-if="todosLoading"
				type="loading"
				:message="$t('Loading your todos...')"
				:show-spinner="true"
			/>

			<!-- Error State -->
			<StateMessage
				v-else-if="error"
				type="error"
				:message="$t(error)"
			/>

			<!-- Empty State -->
			<StateMessage
				v-else-if="hasLoaded && todos.length === 0"
				type="empty"
				:message="$t('Good news! You don\'t have any todos for now.')"
			/>

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
@use "~/assets/styles/__mixins" as *;

.todos-page {
	@include page-wrapper;

	min-height: 100vh;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 var(--space-6);
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
