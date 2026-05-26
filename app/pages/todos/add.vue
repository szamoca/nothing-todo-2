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
			<PageHeader :title="$t('Create a New Todo')" />

			<form
				@submit.prevent="handleAddTodo"
				class="add-todo-form tile-offset"
			>
				<FormField
					id="todo-text"
					v-model="todoText"
					type="textarea"
					:label="$t('Todo')"
					:placeholder="$t('Enter your todo...')"
					:disabled="isLoading"
					:required="true"
					:rows="4"
				/>

				<p
					v-if="errorMessage"
					class="text-error"
				>
					{{ errorMessage }}
				</p>

				<Button
					type="submit"
					variant="primary"
					:loading="isLoading"
				>
					{{ isLoading ? $t("Adding...") : $t("Add Todo") }}
				</Button>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.add-todo-page {
	@include container(600px);
	@include page-wrapper;
}

.add-todo-container {
	@include flex-column;

	gap: var(--space-6);
}

.add-todo-form {
	@include flex-column;

	gap: var(--space-6);
}
</style>
