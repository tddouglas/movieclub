import {ref} from 'vue'
import {supabase} from '@/database/supabaseClient'
import {PollSummary} from "@/components/polls/pollTypes.ts"
import type {Tables} from "@/database/supabaseTypes.ts"

type VoteSummaryRow = Tables<"get_vote_summary">


/** Function to fetch raw vote summary data using a Postgres function **/
async function fetchVoteSummaries(): Promise<VoteSummaryRow[]> {
	const {data, error} = await supabase
		.from('get_vote_summary')
		.select('*')
	if (error) throw error
	return data as VoteSummaryRow[]
}

/** Function to format the raw data into a grouped mapping **/
function formatVoteSummaries(rows: VoteSummaryRow[]): Record<string, PollSummary> {
	const grouped: Record<string, PollSummary> = {}

	rows.forEach(row => {
		if (!row.poll_id) {
			throw TypeError(`Poll id ${row.poll_id} does not exist`)
		}

		if (!grouped[row.poll_id]) {
			grouped[row.poll_id] = {
				poll_id: row.poll_id,
				date: row.date ? formatDate(row.date) : "",
				nominator_name: row.nominator_name || '',
				season_name: row.season_name ? formatSeason(row.season_name) : '',
				winning_movie_name: row.winning_movie_name || '',
				nested: []
			}
		}

		if (row.poll_option_text) {
			let voteGroup = grouped[row.poll_id].nested.find(item => item.poll_option_text === row.poll_option_text)
			if (!voteGroup) {
				voteGroup = {poll_option_text: row.poll_option_text, user_names: []}
				grouped[row.poll_id].nested.push(voteGroup)
			}
			if (row.user_name && !voteGroup.user_names.includes(row.user_name)) {
				voteGroup.user_names.push(row.user_name)
			}
		}
	})

	return grouped
}

const formatDate = (date: string): string => {
	const [year, month, day] = date.split('-')
	const shortYear = year.slice(-2)
	return `${month}/${day}/${shortYear}`
}

const formatSeason = (season: string): string => {
	return season.split(' ')[1]
}

/** Composable that exposes reactive state **/
export function usePollSummaries() {
	const pollSummaries = ref<Record<string, PollSummary>>({})
	const loading = ref(false)
	const error = ref<Error | null>(null)

	async function fetchPollData() {
		loading.value = true
		error.value = null
		try {
			const rawData = await fetchVoteSummaries()
			const formattedVoteSummaries = formatVoteSummaries(rawData)
			console.log("Formatted vote summaries are:\n", formattedVoteSummaries)
			pollSummaries.value = formattedVoteSummaries
		} catch (err) {
			error.value = err as Error
		} finally {
			loading.value = false
		}
	}

	return {pollSummaries, loading, error, fetchPollData}
}
