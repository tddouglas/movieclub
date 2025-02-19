<template>
	<div class="min-h-screen bg-gray-900 text-white">
		<NavBar v-if="userStore.isLoggedIn" />
		<main class="container mx-auto pt-20">
			<router-view></router-view>
		</main>
	</div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
userStore.loadUserSession() // Loading user session on app startup
</script>

<style>
#app {
  width: 100%;
  margin: 0 auto;
}
</style>