<template>
	<div class="md:p-22">
		<AttendanceChartContainer></AttendanceChartContainer>
		<PollHistory></PollHistory>
	</div>
</template>
<script setup lang="ts">
import AttendanceChartContainer from "@/components/charts/AttendanceChartContainer.vue";
import PollHistory from "@/components/polls/PollHistory.vue";
</script>