<template>
	<div class="mb-4 flex justify-center">
		<div class="relative w-2/3">
			<input
				v-model="inputValue"
				:placeholder="placeholder"
				class="w-full min-h-16 text-2xl text-center bg-darkerMain focus:outline-secondary  transition-all duration-200"/>
			<div class="absolute bottom-0 left-0 w-full h-[3px] bg-black rounded-full"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
	modelValue: string;
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
