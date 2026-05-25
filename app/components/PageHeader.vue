<script lang="ts" setup>
interface Props {
	title: string;
	subtitle?: string;
	align?: "left" | "center" | "right";
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const props = withDefaults(defineProps<Props>(), {
	subtitle: "",
	align: "center",
	level: 1,
});

// Determine heading tag based on level prop
const headingTag = computed(() => `h${props.level}`);

// Determine alignment class
const alignmentClass = computed(() => `page-header-${props.align}`);
</script>

<template>
	<header
		class="page-header"
		:class="alignmentClass"
	>
		<component
			:is="headingTag"
			class="page-header-title"
		>
			{{ title }}
		</component>

		<p
			v-if="subtitle"
			class="page-header-subtitle text-muted"
		>
			{{ subtitle }}
		</p>
	</header>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

// ========================================================================
// Page Header Container
// ========================================================================

.page-header {
	@include flex-column;

	gap: var(--space-4);
	margin-bottom: var(--space-10);
}

// ========================================================================
// Alignment Variants
// ========================================================================

.page-header-left {
	align-items: flex-start;
	text-align: left;
}

.page-header-center {
	align-items: center;
	text-align: center;
}

.page-header-right {
	align-items: flex-end;
	text-align: right;
}

// ========================================================================
// Title
// ========================================================================

.page-header-title {
	font-family: "Space Grotesk", sans-serif;
	font-size: var(--text-4xl);
	font-weight: 700;
	color: var(--color-text);
	letter-spacing: -0.02em;
	margin: 0;

	@media (width >= 768px) {
		font-size: var(--text-5xl);
	}
}

// ========================================================================
// Subtitle
// ========================================================================

.page-header-subtitle {
	font-family: "IBM Plex Mono", monospace;
	font-size: var(--text-base);
	margin: 0;
	max-width: 60ch;

	@media (width >= 768px) {
		font-size: var(--text-lg);
	}
}
</style>
