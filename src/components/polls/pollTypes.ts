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

type VotesMapping = Record<string, number>

// Define the type for the PollCrud instance including the exposed enableButton method.
type PollCrudInstance = ComponentPublicInstance<{
	enableButton: () => void
}>

export type {Poll, PollOption, PollVoteCount, PollCrudInstance, VotesMapping}