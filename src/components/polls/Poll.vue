<template>
	<div class="bg-black/50 shadow-md rounded-lg p-4">
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
					class="relative w-full py-2 px-4 text-white font-semibold transition"
					@click="vote(option.id, option.poll_id)"
				>
					{{ option.text }} ({{ votes[option.id] || 0 }} votes)
				</button>
			</div>
		</div>
		<div v-else>
			No Options
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, PropType} from "vue";
import {useUserStore} from "@/stores/user.ts"
import {supabase} from "@/database/supabaseClient.ts"
import type {Tables} from "@/database/supabaseTypes.ts"
import {Poll, VotesMapping} from "@/components/polls/pollTypes.ts"

type PollOptions = Tables<"poll_options">

const userStore = useUserStore()
const props = defineProps({
	poll: {type: Object as PropType<Poll>, required: true}
})
const options = ref<PollOptions[]>([])
const votes = ref<VotesMapping>({})

const fetchOptions = async () => {
	if (!props.poll.id) {
		throw new Error("No poll found")
	}

	let {data, error} = await supabase.from("poll_options")
		.select("*")
		.eq("poll_id", props.poll.id)
	if (error || !data) console.error(error);
	else options.value = data;
};

const fetchVotes = async () => {
	console.log("Fetch votes triggered")
	const poll_ids = options.value.map(entry => entry.id);
	let {data, error} = await supabase
		.from("poll_votes")
		.select("poll_option_id")
		.in("poll_option_id", poll_ids)

	// console.log(`Vote res is: ${JSON.stringify(data)}`);

	if (error || !data) console.error(error);
	else votes.value = data.reduce((acc: VotesMapping, entry): VotesMapping => {
		const id = entry.poll_option_id
		acc[id] = (acc[id] || 0) + 1
		return acc
	}, {} as VotesMapping)
};

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
};

// Compute total votes to calculate percentages
const totalVotes = computed(() => {
	return Object.values(votes.value).reduce((sum, count) => sum + count, 0);
});

// Get vote percentage for each option
const getVotePercentage = (optionId: string) => {
	if (totalVotes.value === 0) return 0;
	return (votes.value[optionId] || 0) / totalVotes.value * 100;
};

// Dynamically change color intensity based on votes
const getVoteColor = (optionId: string) => {
	const baseColor = 100 + Math.min(8 * (votes.value[optionId] || 0), 800); // Scale color from blue-100 to blue-900
	return `rgb(59, 130, 246, ${0.3 + Math.min(0.7, (votes.value[optionId] || 0) / 10)})`; // Adjust opacity
};

// Listen for live vote updates
onMounted(async () => {
	await fetchOptions();
	await fetchVotes();

	const subscription = supabase
		.channel("poll_votes")
		.on("postgres_changes", {event: "INSERT", schema: "public", table: "poll_votes"}, fetchVotes)
		.subscribe();

	return () => subscription.unsubscribe();
});
</script>