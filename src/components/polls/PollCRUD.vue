<template>
	<div class="mb-6">
		<div class="shadow px-6 rounded-lg">
			<form @submit.prevent="" class="space-y-4">
				<MovieClubInputTitle
					v-model="activePollQuestion"
					label="Poll Question"
					type="textarea"
					placeholder="Poll Question"
				/>
				<transition-group
					tag="div"
					enter-active-class="transition-all duration-500 ease-out"
					enter-from-class="opacity-0 -translate-y-5"
					enter-to-class="opacity-100 translate-y-0"
					leave-active-class="transition-all duration-500 ease-in"
					leave-from-class="opacity-100 translate-y-0"
					leave-to-class="opacity-0 -translate-y-5"
				>
					<div v-for="(element, index) in activePollOptions" :key="element.order">
						<MovieClubInputs
							v-model="element.text"
							type="text"
							:label="`Option ${element.order + 1}`"
							:placeholder="`Enter option ${element.order + 1}`"
						/>
					</div>
				</transition-group>
				<div class="flex justify-center space-between pt-4">
					<div v-if="selectedPollId" class="flex flex-row gap-4">
						<MovieClubButton
							buttonText="Update Poll"
							:loading="pollLoading"
							@movieButtonClick="updatePoll"
						/>
						<MovieClubButton
							v-if="selectedPollId"
							buttonText="Close Poll"
							:loading="pollLoading"
							@movieButtonClick="closePoll"
						/>
					</div>
					<div v-else>
						<MovieClubButton
							class="min-w-40"
							buttonText="Create Poll"
							:loading="pollLoading"
							@movieButtonClick="createPoll"
						/>
					</div>
				</div>
			</form>

			<!-- Tie-breaker Modal -->
			<div v-if="showTieModal"
				 class="fixed inset-0 bg-darkerMain bg-opacity-50 flex items-center justify-center">
				<div class="bg-main p-6 rounded-lg shadow-lg mx-4 relative">
					<button
						@click="showTieModal = false"
						class="absolute top-3 right-3 text-main hover:text-gray-700"
					>
						✕
					</button>
					<h2 class="text-xl font-semibold mb-4 text-center">Tie Detected</h2>
					<p class="pb-4">Select the winning option:</p>
					<select
						v-model="chosenWinner"
						class="w-full p-3 bg-darkerMain text-white border border-gray-400 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500
         hover:bg-opacity-80 transition-all"
					>
						<option
							v-for="option in tiedOptions"
							:key="option.poll_option_id"
							:value="option.poll_option_id"
							class="text-black bg-white"
						>
							{{ option.text }} ({{ option.count }} votes)
						</option>
					</select>

				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import {ref, onMounted, watch, PropType} from 'vue';
import {supabase} from "@/database/supabaseClient"
import type {PollOption, PollVoteCount} from "@/components/polls/pollTypes.ts";
import MovieClubInputs from '@/components/MovieClubInput.vue';
import MovieClubButton from "@/components/MovieClubButton.vue";
import MovieClubInputTitle from "@/components/MovieClubInputTitle.vue";


const props = defineProps({
	selectedPollId: {type: String as PropType<string | null>, required: true},
	question: {type: String, required: true},
	options: {type: Array as PropType<PollOption[]>, required: true},
})
const emits = defineEmits(['poll-updated'])

// Duplicate Poll State to compare against original props for updates
const activePollQuestion = ref<string>(props.question)
const activePollOptions = ref<PollOption[]>(JSON.parse(JSON.stringify(props.options))) // Creating deep copy of prop

// Loading state to disable buttons
const pollLoading = ref(false)

// For closing polls.
const showTieModal = ref(false);
const tiedOptions = ref<PollVoteCount[]>([]);
const chosenWinner = ref<string | null>(null);


// Create a new poll.
const createPoll = async () => {
	console.log("Create poll triggered")
	pollLoading.value = true
	const {data: pollData} = await supabase
		.from('polls')
		.insert({question: activePollQuestion.value, active: true})
		.select()
		.single()
		.throwOnError()

	// Get the newly created poll's ID.
	const pollId: string = pollData.id;
	console.log("Poll created with ID:", pollId);

	// Iterate over each poll option and insert non-empty options.
	for (const option of activePollOptions.value) {
		const poll_text = option.text.trim()
		if (poll_text !== '') {
			const {error: optionError} = await supabase
				.from('poll_options')
				.insert({poll_id: pollId, text: option.text});
			if (optionError) throw optionError;
		}
	}
	emits('poll-updated')
	pollLoading.value = false
};

const updatePoll = async () => {
	console.log("Update poll triggered")
	let updateOccurred = false
	pollLoading.value = true

	if (!props.selectedPollId) {
		throw new ReferenceError("No Selected Poll ID Available to PollCRUD")
	}

	// Update question if it has been updated
	if (activePollQuestion.value !== props.question) {
		console.log("updating question")
		await supabase
			.from("polls")
			.update({question: activePollQuestion.value})
			.eq("id", props.selectedPollId)
			.throwOnError()
		updateOccurred = true
	}

	// Compare options and determine changes
	const propOptionMap = new Map(
		props.options.map((option) => [option.id, option.text])
	);

	for (const pollOption of activePollOptions.value) {
		const propOptionText = propOptionMap.get(pollOption.id);

		// If there is no corresponding option in the props list, ID is new
		if (pollOption.text && !propOptionText) {
			console.log("inserting new poll option")
			await supabase.from("poll_options").insert({
				poll_id: props.selectedPollId,
				text: pollOption.text,
			});
			updateOccurred = true
		}
		// If option text has changed, delete & insert a new option**
		else if (pollOption.text && pollOption.text !== propOptionText) {
			console.log("updating existing poll option")
			await supabase.from("poll_options").delete().eq("id", pollOption.id);
			await supabase.from("poll_options").insert({
				poll_id: props.selectedPollId,
				text: pollOption.text,
			});
			updateOccurred = true
		}
	}

	if (updateOccurred) {
		console.log("updating occurred in poll, emitting")
		emits('poll-updated')
	} else {
		console.log("no update occurred in poll")
		pollLoading.value = false
	}

}

const closePoll = async () => {
	console.log("closePoll triggered")

	if (!props.selectedPollId) {
		throw new ReferenceError("No Selected Poll ID Available in component")
	}

	// **Step 1:** Fetch all votes for selected poll
	const {data: votes} = await supabase
		.from("poll_votes")
		.select("id, poll_option_id, poll_options(text), user_id")
		.eq("poll_id", props.selectedPollId)
		.throwOnError()

	if (!votes || votes.length === 0) {
		alert("No votes found for this poll.");
		return;
	}

	// **Step 2**: Manually count votes for each poll_option_id (GUID as key)
	const voteCounts: Record<string, { count: number, text: string }> = {}
	votes.forEach(({poll_option_id, poll_options: {text}}) => {
		if (!voteCounts[poll_option_id]) {
			voteCounts[poll_option_id] = {count: 0, text};
		}
		voteCounts[poll_option_id].count++;
	})

	// **Step 3: Convert to array and sort by highest votes**
	const sortedVotes: PollVoteCount[] = Object.entries(voteCounts)
		.map(([poll_option_id, {count: count, text: text}]) => ({poll_option_id, count, text}))
		.sort((a, b) => b.count - a.count);

	console.log("Vote counts:", sortedVotes);

	// **Step 4**: Check Tie
	const maxVotes = sortedVotes[0].count;
	const winners = sortedVotes.filter((v) => v.count === maxVotes);

	// **Step 5a**: If Tie detected, show modal to selected winner
	if (winners.length > 1) {
		showTieModal.value = true;
		tiedOptions.value = winners;

		try {
			const winningOptionId = await waitForWinnerSelection();
			const winnerText = voteCounts[winningOptionId].text
			await finalizePollClose(props.selectedPollId, winningOptionId, winnerText);
		} catch (error) {
			console.log("Poll closure aborted.");
		}

		return
	}

	// **Step 5b**: If no Tie detected, update DB to finalize winner
	const winningOptionId = winners[0].poll_option_id
	const winnerText = voteCounts[winningOptionId].text
	await finalizePollClose(props.selectedPollId, winningOptionId, winnerText)
}

const finalizePollClose = async (pollId: string, winningOptionId: string, movieTitle: string) => {
	// console.log("finalizePollClose", pollId, winningOptionId)
	// **Step 6**: Insert winner into movies table
	const {data: movieData} = await supabase
		.from("movies")
		.insert([{title: movieTitle}])
		.select("id")
		.single()
		.throwOnError()

	const winningMovieId = movieData.id;
	const today = new Date();
	const yyyymmdd_Date = today.toISOString().slice(0, 10);

	// **Step 7**: Update polls table to mark as closed
	await supabase
		.from("polls")
		.update({active: false, closed_at: today.toISOString()})
		.eq("id", pollId)
		.throwOnError()

	// **Step 8**: Fetch the current season (not closed)
	const {data: seasonData} = await supabase
		.from("seasons")
		.select("id")
		.is("end_date", null)
		.single()
		.throwOnError()

	const seasonId = seasonData.id;

	// **Step 8**: Insert into club_sessions
	await supabase
		.from("club_sessions")
		.insert([{
			date: yyyymmdd_Date,
			season_id: seasonId,
			poll_id: pollId,
			winning_movie_id: winningMovieId
		}])
		.throwOnError()

	console.log("Poll successfully closed!")
	emits('poll-updated')

}

// **Helper function: Waits for the admin to select a winner**
function waitForWinnerSelection(): Promise<string> {
	return new Promise((resolve, reject) => {
		// Watch for changes in `chosenWinner`
		const stopWatching = watch(chosenWinner, (value) => {
			if (value) {
				stopWatching(); // Stop watching to avoid memory leaks
				showTieModal.value = false;
				resolve(value); // Return the selected winner
			}
		});

		// If user cancels, reject the promise to abort the process
		const stopModalWatcher = watch(showTieModal, (isVisible) => {
			if (!isVisible) {
				stopModalWatcher(); // Stop watching
				stopWatching();
				reject(new Error("User cancelled tie-breaking selection"));
			}
		});
	});
}


const checkIfActivePollsFull = () => {
	const allActivePollOptionsFilled = activePollOptions.value.every(option => option.text &&
		option.text.trim().length > 0);
	if (activePollOptions.value.length < 4 && allActivePollOptionsFilled) {
		console.log("Adding empty poll option due to mount")
		activePollOptions.value.push({id: "", text: "", order: activePollOptions.value.length})
	}
}

// Expose a method so the parent can re-enable the button.
defineExpose({
	enableButton: (): void => {
		pollLoading.value = false
	}
})

// Add additional options to poll when pollOptions list changes
watch(
	() => activePollOptions.value.map(option => option.text),
	(newValues, oldValues) => {
		newValues.forEach((newText, index) => {
			if (activePollOptions.value.length < 4 && oldValues[index] === '' && newText !== '') {
				console.log(`Option ${activePollOptions.value[index].id} changed from empty to: ${newText}. Adding empty poll value`)
				activePollOptions.value.push({id: "", text: "", order: activePollOptions.value.length})
			}
		})
		checkIfActivePollsFull()
	},
	{deep: false}
)

// Watch for changes in props.options to update activePollOptions
watch(
	() => props.options,
	(newOptions) => {
		console.log("New prop options update")
		activePollOptions.value = JSON.parse(JSON.stringify(newOptions))
	}
)

onMounted(() => {
	checkIfActivePollsFull()
})
</script>


<style scoped>
/* Center modal on screen */
.fixed {
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Close button styling */
button.absolute {
	font-size: 1.25rem;
	background: none;
	border: none;
	cursor: pointer;
}
</style>