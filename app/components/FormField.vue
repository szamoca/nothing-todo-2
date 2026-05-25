<script lang="ts" setup>
interface Props {
	id: string;
	label: string;
	modelValue: string;
	type?: "text" | "password" | "textarea";
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
	rows?: number;
	autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	placeholder: "",
	required: false,
	disabled: false,
	error: "",
	rows: 4,
	autocomplete: undefined,
});

interface Emits {
	(event: "update:modelValue", value: string): void;
}

const emit = defineEmits<Emits>();

function handleInput(event: Event) {
	const target = event.target as HTMLInputElement | HTMLTextAreaElement;
	emit("update:modelValue", target.value);
}

const ariaInvalid = computed(() => (props.error ? "true" : undefined));
const ariaRequired = computed(() => (props.required ? "true" : undefined));
const ariaDescribedby = computed(() => (props.error ? `${props.id}-error` : undefined));
</script>

<template>
	<div class="form-field">
		<label
			:for="id"
			class="form-field-label"
		>
			{{ label }}
		</label>

		<textarea
			v-if="type === 'textarea'"
			:id="id"
			:value="modelValue"
			:placeholder="placeholder"
			:required="required"
			:disabled="disabled"
			:rows="rows"
			:aria-invalid="ariaInvalid"
			:aria-required="ariaRequired"
			:aria-describedby="ariaDescribedby"
			class="input form-field-textarea"
			@input="handleInput"
		/>

		<input
			v-else
			:id="id"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:required="required"
			:disabled="disabled"
			:autocomplete="autocomplete"
			:aria-invalid="ariaInvalid"
			:aria-required="ariaRequired"
			:aria-describedby="ariaDescribedby"
			class="input"
			@input="handleInput"
		/>

		<p
			v-if="error"
			:id="`${id}-error`"
			class="form-field-error text-error"
			role="alert"
		>
			{{ error }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/__mixins" as *;

.form-field {
	@include flex-column;

	gap: var(--space-2);
}

.form-field-label {
	font-weight: 500;
	font-size: var(--text-sm);
	color: var(--color-text);
}

.form-field-textarea {
	min-height: 120px;
	resize: vertical;
	font-family: "IBM Plex Mono", monospace;
}

.form-field-error {
	font-size: var(--text-sm);
	margin-top: var(--space-1);
}
</style>
