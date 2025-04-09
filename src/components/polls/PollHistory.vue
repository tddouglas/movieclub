<template>
	<MovieClubTable :labels="headers" :rows="rowsArray" :mapping="mapping" class=""/>
</template>

<script lang="ts" setup>
import {onMounted, computed} from "vue"
import {storeToRefs} from "pinia"
import {usePollVotesStore} from "@/stores/pollVotes.ts"
import MovieClubTable from "@/components/movieClubUI/MovieClubTable.vue"

const pollVotesStore = usePollVotesStore()
const {allVotes} = storeToRefs(pollVotesStore)
const headers = ['Date', 'Nominator', 'Season', 'Winner']
// mapping of header name to value in row
const mapping = {
	'Date': 'date',
	'Nominator': 'nominator_name',
	'Season': 'season_name',
	'Winner': 'winning_movie_name'
}

// Convert the record to an array of PollSummary objects
const rowsArray = computed(() => Object.values(allVotes.value))

onMounted(async () => {
	await pollVotesStore.fetchAllVotes()
})
</script>
