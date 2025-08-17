<template>
  <!-- If a poll has not been selected, show list of polls available for edit -->
  <template v-if="!selectedPollId">
    <div v-for="poll in pollList">
      <div>{{ poll.created_at }}</div>
      <div>{{ poll.id }}</div>
      <div>{{ poll.nominator_id }}</div>
      <MovieClubButton button-text="Edit Poll" @movieButtonClick="editPoll(poll.id)"/>
    </div>
  </template>

  <template v-else>
    <h2>Editing: {{ selectedPollId }}</h2>
    <!-- TODO: Display list of users who attended specific session. Allow for selecting a given user to remove them from
    session-->
    <!-- TODO: Add button which allows for user to be added to the specific poll ID session. Display list of all
    users-->
  </template>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {supabase} from "@/database/supabaseClient.ts"
import type {Tables} from "@/database/supabaseTypes.ts"
import MovieClubButton from "@/components/movieClubUI/MovieClubButton.vue";

type Poll = Tables<"polls">

const pollList = ref<Poll[]>()
const selectedPollId = ref<string | null>(null)

const editPoll = async (pollId: string) => {
  selectedPollId.value = pollId
}

const fetchPolls = async () => {
  const {data} = await supabase
      .from('polls')
      .select('*')
      .eq('active', true)
      .throwOnError()
  pollList.value = data
}

onMounted(fetchPolls())
</script>