<template>
	<div class="p-4">
		<h2 class="text-lg font-semibold">{{ poll.question }}</h2>
		<div v-if="options.length > 0" class="mt-4 space-y-2">
			<div
				v-for="option in options"
				:key="option.id"
				class="relative w-full bg-gray-700 rounded-lg overflow-hidden"
			>
				<!-- Dynamic vote bar -->
				<div
					class="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
					:style="{
						width: getVotePercentage(option.id) + '%',
						backgroundColor: getVoteColor(option.id)
					}"
				></div>

				<!-- Button overlay for interaction -->
				<button
					class="relative w-full py-2 px-4 font-semibold transition"
					:class="userVoteOptionId === option.id ? 'text-yellow-400' : 'text-white'"
					@click="vote(option.id, option.poll_id)"
				>
					{{ option.text }} ({{ voteMapping[option.id] || 0 }} votes)
				</button>
			</div>
		</div>
		<div v-else>
			No Options
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, PropType} from "vue"
import {storeToRefs} from 'pinia'
import {useUserStore} from "@/stores/user.ts"
import {usePollVotesStore} from "@/stores/pollVotes.ts"
import {supabase} from "@/database/supabaseClient.ts"
import {VotesMapping} from "@/components/polls/pollTypes.ts"
import type {Tables} from "@/database/supabaseTypes.ts"

type PollType = Tables<"polls">
type PollOptions = Tables<"poll_options">

const userStore = useUserStore()
const pollVotesStore = usePollVotesStore()

const props = defineProps({
	poll: {type: Object as PropType<PollType>, required: true}
})

const options = ref<PollOptions[]>([])

// Use storeToRefs to extract reactive votes var from the store
const {votes} = storeToRefs(pollVotesStore)
const {fetchVotes, subscribeToPollVotes, unsubscribe} = pollVotesStore

// Find the option id that the current user voted for (if any)
const userVoteOptionId = computed(() => {
	const userVote = votes.value.find(vote => vote.user_id === userStore.user.id);
	return userVote ? userVote.poll_option_id : null;
})

// Compute a mapping of poll_option_id to number of votes
const voteMapping = computed<VotesMapping>(() => {
	return votes.value.reduce((acc, vote) => {
		const id = vote.poll_option_id;
		acc[id] = (acc[id] || 0) + 1;
		return acc;
	}, {} as VotesMapping);
})

// Fetch a list of options for the poll.id prop
const fetchOptions = async () => {
	if (!props.poll.id) {
		throw new Error("No poll found")
	}

	let {data, error} = await supabase.from("poll_options")
		.select("*")
		.eq("poll_id", props.poll.id)
	if (error || !data) console.error(error);
	else options.value = data;
}

// Place Vote - If User already voted, update vote
const vote = async (optionId: string, pollId: string) => {
	const userId = userStore.user.id;

	// Check if the user has already voted in this poll
	const {data: existingVote, error} = await supabase
		.from("poll_votes")
		.select("id, poll_option_id")
		.eq("user_id", userId)
		.eq("poll_id", pollId)
		.maybeSingle()

	if (existingVote && existingVote.poll_option_id === optionId) {
		console.log("User has already voted for this option, no changes needed.");
		return
	} else if (existingVote) {
		console.log("The user has voted for a different option, delete the previous vote")
		const {error: deleteError} = await supabase
			.from("poll_votes")
			.delete()
			.eq("id", existingVote.id);

		if (deleteError) {
			console.error("Error deleting previous vote:", deleteError);
			return;
		}
	}

	// Insert the new vote
	const {error: insertError} = await supabase
		.from("poll_votes")
		.insert([{poll_option_id: optionId, user_id: userId, poll_id: pollId}]);

	if (insertError) {
		console.error("Error inserting new vote:", insertError);
	} else {
		console.log("Vote recorded successfully!");
	}
}

// Compute total votes across all options
const totalVotes = computed(() => {
	return Object.values(voteMapping.value).reduce((sum, count) => sum + count, 0)
})

// Compute the percentage for a given option
const getVotePercentage = (optionId: string) => {
	if (totalVotes.value === 0) return 0;
	return ((voteMapping.value[optionId] || 0) / totalVotes.value) * 100;
}

// Dynamically adjust the vote bar color and opacity based on number of votes using a blue scale
const getVoteColor = (optionId: string) => {
	return `rgb(59, 130, 246, ${0.3 + Math.min(0.7, (voteMapping.value[optionId] || 0) / 10)})`
}

// Listen for live vote updates
onMounted(async () => {
	await fetchOptions()
	await fetchVotes(props.poll.id)
	await subscribeToPollVotes(props.poll.id)
})

// Clean up the subscription when the component is unmounted.
onUnmounted(() => {
	unsubscribe()
})
</script>