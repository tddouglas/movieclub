<template>
	<div class="px-4">
		<h1 class="text-2xl font-bold text-center">Live Vote</h1>
		<div v-if="polls.length" class="mt-4 space-y-4">
			<Poll v-for="poll in polls" :key="poll.id" :poll="poll" />
		</div>
		<p v-else class="text-center text-gray-500">No active polls</p>
	</div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/database/supabaseClient"
import Poll from "@/components/Poll.vue";

const polls = ref([]);

const fetchPolls = async () => {
	let { data, error } = await supabase.from("polls").select("*").eq("active", true);
	if (error) console.error(error);
	else polls.value = data;
};

onMounted(fetchPolls);
</script>

