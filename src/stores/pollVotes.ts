import {defineStore} from 'pinia'
import {ref} from 'vue'
import {supabase} from '@/database/supabaseClient'
import {usePollSummaries} from '@/composables/fetchAllVotes.ts'
import type {PollSummary, PollVotesPerUser} from '@/components/polls/pollTypes'

export const usePollVotesStore = defineStore('pollVotes', () => {
	// State to store votes
	const votes = ref<PollVotesPerUser[]>([])
	const allVotes = ref<Record<string, PollSummary>>({})
	let subscription: any = null

	// Fetch initial votes for a given poll_id
	async function fetchPollVotes(poll_id: string) {
		const {data} = await supabase
			.from('poll_votes')
			.select(`
				id,
				cast_at,
				poll_option_id,
				poll_options (
					text
				),
				user_id,
				users (
					display_name
				)
			`)
			.eq('poll_id', poll_id)
			.order('cast_at', {ascending: false})
			.throwOnError()

		votes.value = data
	}

	// Fetch All Votes Grouped by poll_id. Use fetchAllVotes composable
	async function fetchAllVotes() {
		const {
			pollSummaries: compPollSummaries,
			loading: compLoading,
			error: compError,
			fetchPollData
		} = usePollSummaries()

		// Fetch the poll data using the composable
		await fetchPollData()

		allVotes.value = compPollSummaries.value
	}

	// Subscribe to new votes for a given poll_id
	async function subscribeToPollVotes(poll_id: string) {
		if (!subscription) {
			console.log("Setting up a subscription")
			subscription = supabase
				.channel('poll_votes')
				.on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'poll_votes'},
					(payload) => {
						// Only update if the vote is for the correct poll
						if (payload.new.poll_id === poll_id) {
							fetchPollVotes(poll_id)
						}
					})
				.subscribe()
		}
	}

	async function unsubscribe() {
		if (subscription) {
			await supabase.removeChannel(subscription)
			subscription = null
		}
	}

	return {votes, allVotes, fetchVotes: fetchPollVotes, fetchAllVotes, subscribeToPollVotes, unsubscribe}
})
