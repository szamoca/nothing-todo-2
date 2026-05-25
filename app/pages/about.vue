<template>
	<div class="about-page">
		<PageHeader
			:title="$t('About Nothing todo')"
			:subtitle="$t('This is a minimal todo app.')"
			align="left"
		/>
		<p class="mb-4">
			{{ $t("Visit the login page to be able to sign in with one of the available dummyJSON users, randomly selected.") }}
		</p>
		<p class="mb-3">
			{{ $t("When signed in, you can see their list of todo items, and set their completion state.") }}
		</p>
		<p class="mb-3">{{ $t("You can also create a new todo from the Create page.") }}</p>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.about-page {
	@include page-wrapper;
}
</style>
