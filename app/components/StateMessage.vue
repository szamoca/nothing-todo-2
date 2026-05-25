<script lang="ts" setup>
interface Props {
	type: "loading" | "error" | "empty" | "info";
	message: string;
	showSpinner?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showSpinner: false,
});

// Determine ARIA live region politeness based on message type
const ariaLive = computed(() => {
	switch (props.type) {
		case "error":
			return "assertive"; // Interrupts screen reader immediately
		case "loading":
		case "empty":
		case "info":
			return "polite"; // Waits for screen reader to finish current announcement
		default:
			return "polite";
	}
});

// Determine role based on message type
const role = computed(() => {
	switch (props.type) {
		case "error":
			return "alert"; // Announces immediately to screen readers
		case "loading":
			return "status"; // Announces as status update
		case "empty":
		case "info":
			return "status"; // Announces as status update
		default:
			return "status";
	}
});

// Determine text styling class
const textClass = computed(() => {
	switch (props.type) {
		case "error":
			return "text-error";
		case "loading":
		case "empty":
		case "info":
			return "text-muted";
		default:
			return "text-muted";
	}
});

// Determine spinner size based on message type
const spinnerSize = computed<"small" | "medium" | "large">(() => {
	// Use medium size for all state messages
	return "medium";
});

// Determine spinner label for accessibility
const spinnerLabel = computed(() => {
	switch (props.type) {
		case "loading":
			return "Loading";
		case "error":
			return "Error indicator";
		case "empty":
			return "Empty state indicator";
		case "info":
			return "Information indicator";
		default:
			return "Loading";
	}
});
</script>

<template>
	<div
		class="state-message"
		:class="`state-message-${type}`"
		:role="role"
		:aria-live="ariaLive"
	>
		<!-- Loading Spinner -->
		<LoadingSpinner
			v-if="showSpinner"
			:size="spinnerSize"
			:label="spinnerLabel"
		/>

		<!-- Message Text -->
		<p
			class="state-message-text"
			:class="textClass"
		>
			{{ message }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

// ========================================================================
// State Message Container
// ========================================================================

.state-message {
	@include flex-column;

	align-items: center;
	justify-content: center;
	gap: var(--space-5);
	padding: var(--space-12) var(--space-6);
	text-align: center;
}

// ========================================================================
// Message Text
// ========================================================================

.state-message-text {
	font-family: "IBM Plex Mono", monospace;
	font-size: var(--text-lg);
	margin: 0;
}

// Type-specific styling
.state-message-error {
	.state-message-text {
		font-weight: 500;
	}
}
</style>
