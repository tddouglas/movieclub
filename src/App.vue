<template>
	<div class="min-h-screen bg-main text-main">
		<NavBar v-if="userStore.isLoggedIn"/>
		<main :class="[userStore.isLoggedIn ? 'container mx-auto pt-20' : '']">
			<router-view></router-view>
		</main>
	</div>
</template>

<script setup lang="ts">
import NavBar from './components/navbar/NavBar.vue'
import {useUserStore} from "@/stores/user"

const userStore = useUserStore()
userStore.loadUserSession() // Loading user session on app startup
</script>

<style scoped>
#app {
	width: 100%;
	margin: 0 auto;
}
</style>