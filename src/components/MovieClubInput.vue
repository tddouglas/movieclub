<template>
	<div class="mb-4">
		<label v-if="label" class="block mb-1 font-medium text-subtext">{{ label }}</label>
		<textarea
			v-if="type === 'textarea'"
			v-model="inputValue"
			:placeholder="placeholder"
			class="w-full p-2 border bg-gray border-gray-300 rounded-md focus:outline-secondary focus:ring-2 focus:ring-blue-500"></textarea>
		<input
			v-else
			:type="type"
			v-model="inputValue"
			:placeholder="placeholder"
			class="w-full p-2 border bg-gray border-gray-300 rounded-md focus:outline-secondary"/>
	</div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
	modelValue: string;
	label?: string;
	type?: string;
	placeholder?: string;
}>();

const emits = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const inputValue = computed({
	get: () => props.modelValue,
	set: (value: string) => emits('update:modelValue', value)
});
</script>
