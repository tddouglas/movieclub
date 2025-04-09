import {ComponentPublicInstance} from "vue";

interface Poll {
	id: string | null;
	question: string;
	options: PollOption[];
}

interface PollOption {
	id: string;
	text: string;
	order: number;
}

interface PollVoteCount {
	poll_option_id: string;
	count: number;
	text: string;
}

interface PollVotesPerUser {
	id: string,
	cast_at: string | null,
	poll_option_id: string,
	poll_options: {
		text: string
	}
	user_id: string,
	users: {
		display_name: string | null
	}
}

type VotesMapping = Record<string, number>

// Define the type for the PollCrud instance including the exposed enableButton method.
type PollCrudInstance = ComponentPublicInstance<{
	enableButton: () => void
}>

/** Types for the get_poll_summary view query and result and final format **/
interface PollSummary {
	poll_id: string
	date: string
	nominator_name: string
	season_name: string
	winning_movie_name: string
	nested: PollVoteGroup[]
}

interface PollVoteGroup {
	poll_option_text: string
	user_names: string[]
}


export type {
	Poll,
	PollOption,
	PollVoteCount,
	PollCrudInstance,
	PollVotesPerUser,
	VotesMapping,
	PollVoteGroup,
	PollSummary
}