<template>

	<div v-if="selectionOrder">
		<div v-if="error" class="text-center text-red-500 mb-4">
			Error: {{ error }}
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Skeleton loaders shown until data is loaded -->
			<template v-if="selectionOrderLoading">
				<div
					v-for="n in skeletonCount"
					:key="n"
					class="bg-gray-800 shadow-md rounded-lg overflow-hidden animate-pulse"
				>
					<div class="bg-gray-700 h-48 w-full"></div>
					<div class="p-4 text-center">
						<div class="h-6 bg-gray-700 rounded w-3/4 mb-2 mx-auto"></div>
						<div class="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
						<div class="h-4 bg-gray-700 rounded w-1/3 mt-2 mx-auto"></div>
					</div>
				</div>
			</template>
			<!-- Render member cards when data is loaded -->
			<template v-else>
				<!--TODO: Add numbering and format in table structure-->
				<div
					v-for="user in selectionOrder"
					:key="user.id"
					class="bg-gray-800 shadow-md rounded-lg overflow-hidden"
				>
					<div class="p-4 text-center">
						<h2 class="text-xl font-bold text-white">{{ user.display_name }}</h2>
						<p v-if="user.club_title" class="text-gray-400">{{ user.club_title }}</p>
					</div>
				</div>
			</template>
		</div>
	</div>

	<!-- No Selection Order Found -->
	<div
		v-else
		class="flex justify-center items-center min-h-[300px] relative center-text"
	>
		<h2>No selection order found</h2>
		<MovieClubButton button-text="Generate Selection Order" :loading="generateSelectionOrderLoading"
						 @movieButtonClick="generateSelectionOrder"/>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {supabase} from "@/database/supabaseClient"
import type {Tables} from "@/database/supabaseTypes.ts"
import MovieClubButton from "@/components/movieClubUI/MovieClubButton.vue";

type User = Tables<"users">

// Reactive state variables
const selectionOrder = ref<User[]>([])
const selectionOrderLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const generateSelectionOrderLoading = ref<boolean>(false)

// Number of skeleton cards to display while loading order data
const skeletonCount = 6

const generateSelectionOrder = async () => {
	generateSelectionOrderLoading.value = true

	// TODO: Add selection order insert functionality
	// Step 1: Fetch all active movie club users

	// Step 2: Randomize Users

	// Step 3: For all users in the randomized list, Update supabase table

	// selectionOrder.value = data  //Result of supabase insert should be used to update ref
	generateSelectionOrderLoading.value = false
}

// Fetch current season selection order
const fetchSelectionOrder = async () => {
	selectionOrderLoading.value = true;

	// Fetch the current season
	const {data: seasonData} = await supabase
		.from("seasons")
		.select("id")
		.is("end_date", null)
		.single()
		.throwOnError()

	const seasonId = seasonData.id;

	const {data, error: fetchError} = await supabase
		.from('selectionOrder')  // TODO: Create table in supabase
		.select('*')
		.is("season", seasonId)
		.order('created_at', {
			ascending: true
		});
	if (fetchError) {
		error.value = fetchError.message;
	} else if (data) {
		selectionOrder.value = data as User[]
	}
	selectionOrderLoading.value = false
}

onMounted(() => {
	fetchSelectionOrder()
})
</script>