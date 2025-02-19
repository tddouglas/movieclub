<template>
	<nav class="fixed top-0 w-full bg-black/50 backdrop-blur-sm z-50">
		<div class="max-w-4xl mx-auto px-4">
			<div class="flex justify-center space-x-8 py-4">
				<router-link
					v-for="item in navItems"
					:key="item.path"
					:to="item.path"
					class="text-white hover:text-primary transition-colors duration-200 relative group"
				>
					{{ item.name }}
					<span
						class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
					></span>
				</router-link>
				<div @click="logout"
					 class="cursor-pointer text-white hover:text-primary transition-colors duration-200"
				>Logout
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useUserStore} from "@/stores/user"
import router from "@/router";

const route = useRoute()
const userStore = useUserStore()
const currentPath = computed(() => route.path)

const navItems = [
	{name: 'Home', path: '/'},
	{name: 'Nominations', path: '/nominations'},
	// {name: 'Club History', path: '/club-history'},
	{name: 'Members', path: '/members'},
	// {name: 'Schedule', path: '/schedule'}
]

const logout = async () => {
	const res = await userStore.logout()
	await router.push({path: '/login'})
}
</script>
