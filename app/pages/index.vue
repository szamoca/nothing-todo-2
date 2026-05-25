<template>
	<div class="home-page">
		<PageHeader
			:title="$t('Hi from Nothing todo')"
			:subtitle="$t('The Nuxt 4 Vue 3 SCSS dummyJSON minimal sticky note manager')"
			align="left"
		/>

		<div class="home-actions">
			<NuxtLink
				to="/about"
				class="btn-primary btn-hero"
			>
				{{ $t("About") }}
			</NuxtLink>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.home-page {
	@include page-wrapper;
}

.home-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: var(--space-6);
}

.btn-hero {
	font-size: var(--text-3xl);
	font-weight: 700;
	padding: 0;
	border-radius: var(--radius-lg);
	letter-spacing: -0.01em;
	width: 200px;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;

	@media (width >= 768px) {
		font-size: var(--text-4xl);
		width: 280px;
		height: 280px;
	}
}
</style>
