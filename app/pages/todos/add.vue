<script lang="ts" setup>
// Composables
const { userId, isAuthenticated, isLoading: userLoading } = useUser();
const { addTodo, error } = useTodos();

// Form state
const todoText = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

// Authentication check and redirect
onMounted(async () => {
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

	if (!isAuthenticated.value) {
		await navigateTo("/login");
	}
});

async function handleAddTodo() {
	if (!todoText.value.trim()) {
		errorMessage.value = $t("Please enter a todo");
		return;
	}

	if (!userId.value) {
		errorMessage.value = $t("Failed to add todo. Please try again.");
		return;
	}

	isLoading.value = true;
	errorMessage.value = "";

	try {
		const success = await addTodo(userId.value, todoText.value.trim());

		if (success) {
			await navigateTo("/todos");
			return;
		}

		errorMessage.value = error.value || $t("Failed to add todo. Please try again.");
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<div class="add-todo-page">
		<div class="add-todo-container">
			<h1 class="add-todo-title">{{ $t("Create a New Todo") }}</h1>

			<form
				@submit.prevent="handleAddTodo"
				class="add-todo-form tile-offset"
			>
				<div class="form-group">
					<label for="todo-text">{{ $t("Todo") }}</label>
					<textarea
						id="todo-text"
						v-model="todoText"
						class="input"
						:placeholder="$t('Enter your todo...')"
						:disabled="isLoading"
						rows="4"
						required
					/>
				</div>

				<p
					v-if="errorMessage"
					class="text-error"
				>
					{{ errorMessage }}
				</p>

				<button
					type="submit"
					class="btn-primary"
					:disabled="isLoading"
				>
					{{ isLoading ? $t("Adding...") : $t("Add Todo") }}
				</button>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.add-todo-page {
	@include container(600px);

	padding-block: var(--space-10);
}

.add-todo-container {
	@include flex-column;

	gap: var(--space-6);
}

.add-todo-title {
	font-size: var(--text-4xl);
	font-weight: 700;
	text-align: center;
	margin-bottom: var(--space-4);
}

.add-todo-form {
	@include flex-column;

	gap: var(--space-6);
}

.form-group {
	@include flex-column;

	gap: var(--space-2);

	label {
		font-weight: 500;
		font-size: var(--text-sm);
		color: var(--color-text);
	}
}

textarea.input {
	min-height: 120px;
	resize: vertical;
	font-family: "IBM Plex Mono", monospace;
}
</style>
