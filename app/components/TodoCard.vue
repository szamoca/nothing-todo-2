<script lang="ts" setup>
interface Props {
	todo: Todo;
	pending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	pending: false,
});

interface Emits {
	(event: "toggle"): void;
	(event: "delete"): void;
}

const emit = defineEmits<Emits>();

function handleToggle() {
	emit("toggle");
}

function handleDelete() {
	emit("delete");
}
</script>

<template>
	<article class="todo-card">
		<p
			class="todo-card-text"
			:class="{ 'todo-card-text-completed': todo.completed }"
		>
			{{ todo.todo }}
		</p>

		<div class="todo-card-actions">
			<button
				type="button"
				:class="todo.completed ? 'btn-ghost' : 'btn-accent'"
				:disabled="pending"
				:aria-busy="pending"
				:aria-label="`${$t('Toggle completion status for todo')}: ${todo.todo}`"
				@click="handleToggle"
			>
				{{ pending ? $t("Toggling...") : $t("Toggle Completion") }}
			</button>

			<button
				type="button"
				class="btn-danger"
				:disabled="pending"
				:aria-busy="pending"
				:aria-label="`${$t('Delete this todo')}: ${todo.todo}`"
				@click="handleDelete"
			>
				{{ pending ? $t("Deleting...") : $t("Delete") }}
			</button>
		</div>
	</article>
</template>

<style lang="scss" scoped>
// ========================================================================
// Todo Card - Modular Tile Design
// ========================================================================

.todo-card {
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

.todo-card-text {
	font-family: "IBM Plex Mono", monospace;
	font-size: var(--text-base);
	line-height: 1.6;
	color: var(--color-text);
	margin: 0;
	overflow-wrap: break-word;

	&-completed {
		font-weight: 700;
		text-decoration: line-through;
		text-decoration-color: var(--color-primary);
		text-decoration-thickness: 2px;
	}
}

// ========================================================================
// Todo Actions (Button Container)
// ========================================================================

.todo-card-actions {
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
