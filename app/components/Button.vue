<script lang="ts" setup>
interface Props {
	variant?: "primary" | "accent" | "danger" | "ghost";
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	loading?: boolean;
	ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
	variant: "primary",
	type: "button",
	disabled: false,
	loading: false,
});

const isDisabled = computed(() => props.disabled || props.loading);

const ariaAttributes = computed(() => {
	const attrs: Record<string, string | boolean> = {};

	if (props.loading) {
		attrs["aria-busy"] = true;
	}

	if (props.ariaLabel) {
		attrs["aria-label"] = props.ariaLabel;
	}

	return attrs;
});
</script>

<template>
	<button
		:type="type"
		:class="['button', `button-${variant}`]"
		:disabled="isDisabled"
		v-bind="ariaAttributes"
	>
		<slot />
	</button>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

// ========================================================================
// Base Button Styles
// ========================================================================

.button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-4) var(--space-6);
	font-size: var(--text-base);
	font-weight: 500;
	font-family: "Space Grotesk", sans-serif;
	border-radius: var(--radius-base);
	transition: all 0.2s ease;
	cursor: pointer;
	border: 1px solid transparent;

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
}

// ========================================================================
// Button Variants
// ========================================================================

.button-primary {
	background-color: var(--color-primary);
	color: var(--ghost-white);

	&:hover:not(:disabled) {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
}

.button-accent {
	background-color: var(--color-accent);
	color: var(--ghost-white);

	&:hover:not(:disabled) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
}

.button-danger {
	background-color: var(--burnt-peach);
	color: var(--ghost-white);
	border: 1px solid var(--burnt-peach);

	&:hover:not(:disabled) {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
}

.button-ghost {
	background-color: transparent;
	border-color: var(--jet-black-light);
	color: var(--color-text);

	&:hover:not(:disabled) {
		background-color: var(--color-surface);
		border-color: var(--color-text);
	}
}
</style>
