<template>
	<MovieClubDivider/>
	<div class="flex flex-col gap-2 px-4 py-2">
		<template v-if="votes.length > 0">
			<transition-group
				tag="div"
				class="flex flex-col gap-2"
				enter-from-class="origin-top scale-y-0 opacity-0"
				enter-to-class="scale-y-100 opacity-100"
				enter-active-class="transition-all duration-500 ease-out"
			>
				<div
					v-for="vote in votes"
					:key="vote.id"
					:class="[
						'py-2 px-3 my-px rounded max-w-[70%] break-words',
						vote.user_id === userStore.user.id ? 'self-start bg-primary' : 'self-end bg-secondary'
					]"
				>
					<div class="text-sm">
						<strong>{{ vote.users.display_name }}</strong> voted for - <strong>{{
							vote.poll_options.text
						}}</strong>
						<br/>
						<!-- Hiding Cast at time for now -->
						<small class="hidden text-xs">{{ localCastAtTime(vote.cast_at) }}</small>
					</div>
				</div>
			</transition-group>
		</template>
		<template v-else>
			<p class="text-center text-gray-500">No votes cast. Votes will appear live as they come in</p>
		</template>
	</div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from 'vue'
import {useUserStore} from "@/stores/user.ts"
import {usePollVotesStore} from "@/stores/pollVotes.ts"
import {storeToRefs} from 'pinia'
import MovieClubDivider from "@/components/MovieClubDivider.vue"

const userStore = useUserStore()
const pollVotesStore = usePollVotesStore()

const props = defineProps({
	poll_id: {type: String, required: true}
})

// Use storeToRefs to extract reactive votes var from the store
const {votes} = storeToRefs(pollVotesStore)
const {fetchVotes, subscribeToPollVotes, unsubscribe} = pollVotesStore

const localCastAtTime = (cast_at: string | null): string => {
	return cast_at ? new Date(cast_at).toLocaleTimeString() : ""
}

onMounted(async () => {
	await fetchVotes(props.poll_id)
	await subscribeToPollVotes(props.poll_id)
})

// Clean up the subscription when the component is unmounted.
onUnmounted(() => {
	unsubscribe()
})
</script>
