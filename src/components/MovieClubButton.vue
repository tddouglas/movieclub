<template>
	<button
		class="px-4 py-2 bg-green-500 text-white rounded-md" :disabled="loading" @click="click">
		{{ props.buttonText }}
	</button>
</template>

<script setup lang="ts">
const props = defineProps({
	buttonText: {type: String},
	loading: {type: Boolean}
})
const emits = defineEmits(['movieButtonClick'])

const click = () => {
	emits('movieButtonClick')
}
</script>