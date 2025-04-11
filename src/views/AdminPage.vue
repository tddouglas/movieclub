<template>
	<div class="p-6">
		<h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
		<CardBox v-for="activePoll in activePolls">
			<PollCrud :selected-poll-id="activePoll.id" :question="activePoll.question"
					  :options="activePoll.options" @poll-updated="handlePollUpdated(activePoll.id)"
					  :ref="(el: Element | ComponentPublicInstance | null) => setPollRef(activePoll.id, el)"></PollCrud>
		</CardBox>
	</div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed, ComponentPublicInstance} from 'vue';
import {supabase} from "@/database/supabaseClient"
import {useUserStore} from "@/stores/user"
import router from "@/router"
import PollCrud from "@/components/polls/PollCRUD.vue";
import CardBox from "@/components/movieClubUI/CardBox.vue";
import type {Poll, PollCrudInstance} from "@/components/polls/pollTypes"

const userStore = useUserStore()
const userProfile = computed(() => userStore.profile);

// Active polls loaded from Supabase.
const activePolls = ref<Poll[]>([]);

// Create a ref object that maps poll IDs to their corresponding PollCrud component instance.
const pollCrudRefs = ref<Record<string, PollCrudInstance | null>>({})


// Helper to assign a child ref to its poll ID.
function setPollRef(id: string | null, el: Element | ComponentPublicInstance | null): void {
	if (id) {
		pollCrudRefs.value[id] = el as PollCrudInstance | null
	}
}

// Load active polls and include related poll options.
const fetchActivePolls = async () => {
	const {data: activePollsQuery} = await supabase
		.from('polls')
		.select('id, question, poll_options!inner (id, text)')
		.eq('active', true)
		.throwOnError()

	activePolls.value = activePollsQuery.map(poll => ({
		id: poll.id,
		question: poll.question,
		options: poll.poll_options.map((option, index) => ({
			...option,
			order: index  // Add order property based on the index.
		}))
	}))
	if (activePolls.value.length === 0) {
		// console.log("Adding to poll")
		activePolls.value.push({
			id: null,
			question: "",
			options: [{id: "", text: "", order: 0}]
		})
	}
}

async function handlePollUpdated(pollId: string | null): Promise<void> {
	await fetchActivePolls()

	if (pollId) {
		const childComponent = pollCrudRefs.value[pollId]
		if (childComponent && typeof childComponent.enableButton === 'function') {
			console.log(`Enable Button triggered in parent for ${pollId}`)
			childComponent.enableButton()
		}
	}
}

// Redirect non-admin users.
onMounted(() => {
	if (!userProfile.value?.admin) {
		router.push('/');
	}
	fetchActivePolls();
});
</script>