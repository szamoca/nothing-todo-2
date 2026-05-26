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
		:class="['btn', `btn-${variant}`]"
		:disabled="isDisabled"
		v-bind="ariaAttributes"
	>
		<slot />
	</button>
</template>
