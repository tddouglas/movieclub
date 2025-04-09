<template>
	<div ref="container" class="w-full max-h-screen overflow-y-auto">
		<table class="w-full text-sm text-left">
			<!-- Fixed header across all resolutions -->
			<thead class="bg-gray-100 text-subtext uppercase tracking-wider sticky top-0 z-10">
			<tr>
				<th
					v-for="label in labels"
					:key="label"
					:class="containerClass"
					class="p-2 md:px-4 border-b border-gray-300 text-center md:text-left"
				>
					{{ label }}
				</th>
			</tr>
			</thead>
			<tbody>
			<!-- For each row -->
			<template v-for="(row, rowIndex) in rows" :key="rowIndex">
				<!-- Primary Row: Remove bottom border when expanded -->
				<tr
					@click="toggleRow(rowIndex)"
					:class="['hover:bg-gray-50 cursor-pointer', expandedRows.includes(rowIndex) ? '' : 'border-b',
					expandedRows.includes(rowIndex-2) ? '' : 'border-t']"
				>
					<td
						v-for="label in labels"
						:key="label"
						class="p-2 md:px-4 text-center md:text-left"
					>
						{{ row[getKey(label)] }}
					</td>
				</tr>
				<!-- Expanded Subrow: Always show a top border -->
				<Transition name="expand">
					<tr v-if="expandedRows.includes(rowIndex)">
						<td :colspan="labels.length" class="px-4 py-2">
							<div class="pl-8 space-y-2">
								<div
									v-for="(group, i) in row.nested"
									:key="i"
									class="p-2 border rounded shadow-sm"
								>
									<div class="font-semibold">
										Option: {{ group.poll_option_text }}
									</div>
									<div class="text-sm">
										Votes: {{ group.user_names.length }}
									</div>
									<div class="text-xs text-gray-600">
										Voters:
										<span v-if="group.user_names.length">
												{{ group.user_names.join(', ') }}
											</span>
										<span v-else>No votes</span>
									</div>
								</div>
							</div>
						</td>
					</tr>
				</Transition>
			</template>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'

// Generic TableRow interface; nested can be any structure (for our PollSummary it is an array of PollVoteGroup)
interface TableRow {
	[key: string]: any

	nested: any
}

const props = defineProps<{
	labels: string[],
	rows: TableRow[],
	// Optional mapping: key is header label, value is property key on the row object
	mapping?: Record<string, string>
}>()

const expandedRows = ref<number[]>([])

const toggleRow = (index: number) => {
	if (expandedRows.value.includes(index)) {
		expandedRows.value = []
	} else {
		expandedRows.value = [index]
	}
}

/**
 * getKey() uses the optional mapping if provided; otherwise it defaults
 * to converting the label to a lowercase string with underscores.
 */
function getKey(label: string): string {
	if (props.mapping && props.mapping[label]) {
		return props.mapping[label]
	}
	return label.toLowerCase().replace(/\s+/g, '_')
}

// Computed stuff for scrolling below table header
const container = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const scrollThreshold = 20 // adjust as needed

const containerClass = computed(() => {
	// Example: when scrolled, apply a different background color class
	return scrolled.value ? 'bg-gray' : ''
})

const onScroll = () => {
	if (container.value) {
		scrolled.value = container.value.scrollTop > scrollThreshold
	}
}

onMounted(() => {
	if (container.value) {
		container.value.addEventListener('scroll', onScroll)
	}
})

onUnmounted(() => {
	if (container.value) {
		container.value.removeEventListener('scroll', onScroll)
	}
})
</script>


<style scoped>
/* Transition for expanding/collapsing the subrow content with 500ms animation */
.expand-enter-active {
	transition: max-height 500ms ease, opacity 500ms ease;
	overflow: hidden;
}

.expand-leave-active {
	transition: max-height 0ms ease, opacity 0ms ease;
	overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
	max-height: 0;
	opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
	max-height: 500px; /* Adjust this value if your expanded content is larger */
	opacity: 1;
}
</style>
