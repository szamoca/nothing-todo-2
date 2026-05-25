<script lang="ts" setup>
interface Props {
	size?: "small" | "medium" | "large";
	message?: string;
	label?: string;
}

const props = withDefaults(defineProps<Props>(), {
	size: "medium",
	message: "",
	label: "Loading",
});

// Compute spinner dimensions based on size
const spinnerSize = computed(() => {
	switch (props.size) {
		case "small":
			return "24px";
		case "medium":
			return "40px";
		case "large":
			return "56px";
		default:
			return "40px";
	}
});

// Compute border width based on size
const borderWidth = computed(() => {
	switch (props.size) {
		case "small":
			return "2px";
		case "medium":
			return "3px";
		case "large":
			return "4px";
		default:
			return "3px";
	}
});

// Compute animation duration based on size
const animationDuration = computed(() => {
	switch (props.size) {
		case "small":
			return "0.6s";
		case "medium":
			return "0.8s";
		case "large":
			return "1s";
		default:
			return "0.8s";
	}
});
</script>

<template>
	<div
		class="loading-spinner"
		:class="`loading-spinner-${size}`"
	>
		<!-- Spinner Visual -->
		<div
			class="loading-spinner-visual"
			role="img"
			:aria-label="label"
			:style="{
				width: spinnerSize,
				height: spinnerSize,
				borderWidth: borderWidth,
				animationDuration: animationDuration,
			}"
		/>

		<!-- Optional Message -->
		<p
			v-if="message"
			class="loading-spinner-message text-muted"
		>
			{{ message }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.loading-spinner {
	@include flex-column;

	align-items: center;
	justify-content: center;
	gap: var(--space-4);
}

.loading-spinner-visual {
	border-style: solid;
	border-color: var(--ghost-white-dark);
	border-top-color: var(--color-primary);
	border-radius: 50%;
	animation: spin linear infinite;
}

@media (prefers-reduced-motion: reduce) {
	.loading-spinner-visual {
		animation-duration: 2s;
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.loading-spinner-message {
	font-family: "IBM Plex Mono", monospace;
	font-size: var(--text-base);
	margin: 0;
	text-align: center;
}

.loading-spinner-small {
	.loading-spinner-message {
		font-size: var(--text-sm);
	}
}

.loading-spinner-large {
	.loading-spinner-message {
		font-size: var(--text-lg);
	}
}
</style>
