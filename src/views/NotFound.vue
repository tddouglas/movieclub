<template>
	<div class="flex items-center justify-center min-h-screen">
		<CardBox class="w-9/12 lg:w-1/2 text-center">
			<img src="@/assets/404_wombat.png" alt="404 Wombat" class="mx-auto w-96 h-96 object-contain"/>
			<h1 class="hidden md:block text-4xl font-bold mt-4 md:mt-8">👷Building Underway 🔨️</h1>
			<h1 class="block md:hidden text-4xl font-bold mt-4 md:mt-8">👷‍♂🔨<br>Building Underway</h1>
			<p class="text-subtext mt-2">Oops! This page is still under construction. Check back later for some
				cool new stuff.</p>
			<router-link to="/"
						 class="mt-8 inline-block px-6 py-2 text-md font-medium rounded-lg bg-gray hover:bg-secondary transition">
				Go Home
			</router-link>
		</CardBox>
	</div>
</template>

<script setup lang="ts">
import CardBox from "@/components/movieClubUI/CardBox.vue";
</script>