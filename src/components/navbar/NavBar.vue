<template>
	<nav class="fixed top-0 w-full bg-navbar backdrop-blur-sm z-50">
		<div class="max-w-4xl mx-auto px-4">
			<!-- Navigation Header -->
			<div class="flex justify-center items-center py-4">
				<!-- Desktop Menu -->
				<div class="hidden md:flex justify-center space-x-8">
					<router-link
						v-for="item in navItems"
						:key="item.path"
						:to="item.path"
						class="relative group hover:text-primary transition-colors duration-200"
					>
						{{ item.name }}
						<span
							class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
						></span>
					</router-link>
					<router-link v-if="userProfile?.admin" key="admin" to="/admin"
								 class="relative group hover:text-primary transition-colors duration-200">
						Admin
						<span
							class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
						></span>
					</router-link>
					<div
						@click="logout"
						class="relative group cursor-pointer hover:text-primary transition-colors duration-200"
					>
						Logout
						<span
							class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
						></span>
					</div>
				</div>
				<!-- Mobile Header: Welcome text and Hamburger -->
				<div class="flex items-center md:hidden">
          <span class="text-white mr-44 md:mr-0" v-if="userStore.profile">
            Welcome, {{ userStore.profile.display_name }}
          </span>
					<button @click="menuOpen = !menuOpen" class="text-white focus:outline-none">
						<img
							 :src="!menuOpen ? navbarHamburger : navbarX"
							 alt="Navbar Menu Open/Close"
							 key="test"
							 class="h-6 w-6"
							 :class="{ 'p-1': menuOpen }"
						>
					</button>
				</div>
			</div>
			<!-- Mobile Menu Dropdown with Transition -->
			<transition
				enter-active-class="transition duration-300 ease-out transform"
				enter-from-class="opacity-0 scale-y-0"
				enter-to-class="opacity-100 scale-y-100"
				leave-active-class="transition duration-200 ease-in transform"
				leave-from-class="opacity-100 scale-y-100"
				leave-to-class="opacity-0 scale-y-0"
			>
				<div v-if="menuOpen" class="md:hidden">
					<div class="flex flex-col text-center pb-4 divide-y divide-gray-300">
						<router-link
							v-for="item in navItems"
							:key="item.path"
							:to="item.path"
							class="relative group block focus:text-primary transition-colors duration-200 py-4"
							@click="menuOpen = false"
						>
							{{ item.name }}
							<span
								class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
							></span>
						</router-link>
						<router-link v-if="userProfile?.admin"
									 to="/admin"
									 @click="menuOpen = false"
									 class="relative group block focus:text-primary transition-colors duration-200 py-4">
							Admin
							<span
								class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
							></span>
						</router-link>
						<div
							@click="handleLogout"
							class="relative group cursor-pointer focus:text-primary transition-colors duration-200 py-4"
						>
							Logout
							<span
								class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
							></span>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</nav>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useUserStore} from "@/stores/user.ts"
import router from "@/router"
import navbarHamburger from '@/assets/navbar_hamburger.svg'
import navbarX from '@/assets/navbar_x.svg'

const userStore = useUserStore()
const menuOpen = ref(false)

const userProfile = computed(() => userStore.profile);

const navItems = [
	{name: 'Home', path: '/'},
	{name: 'Nominations', path: '/nominations'},
	{name: 'Club History', path: '/club-history'},
	{name: 'Members', path: '/members'},
]

const logout = async () => {
	await userStore.logout()
	await router.push({path: '/login'})
}

// Logout for mobile: closes the menu after logging out.
const handleLogout = async () => {
	await logout()
	menuOpen.value = false
}
</script>
