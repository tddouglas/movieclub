<template>
	<button
		class="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary font-semibold transition"
		:disabled="loading"
		@click="click">
		{{ props.buttonText }}
	</button>
</template>

<script setup lang="ts">
const props = defineProps({
	buttonText: {type: String},
	loading: {type: Boolean, default: false},
})
const emits = defineEmits(['movieButtonClick'])

const click = () => {
	emits('movieButtonClick')
}
</script>