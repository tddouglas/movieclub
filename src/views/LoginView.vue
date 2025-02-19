<template>
	<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center"
		 :style="{ backgroundImage: `url(${bgImage})` }">
		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-black bg-opacity-50"></div>

		<!-- Login Form -->
		<div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
			<h2 class="text-2xl font-bold text-gray-800 text-center">Login</h2>
			<form class="mt-4">
				<div>
					<label class="block text-gray-700">Email</label>
					<input v-model="credentials.email" type="email"
						   class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
				</div>
				<div class="mt-4">
					<label class="block text-gray-700">Password</label>
					<input v-model="credentials.password" type="password"
						   class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
				</div>
				<button type="submit" @click.prevent="handleLogin"
						class="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
					Login
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"
import bgImage from '@/assets/movieclub_entertained.jpeg'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const credentials = ref({
	email: "",
	password: ""
})

const handleLogin = async () => {
	try {
		loading.value = true
		console.log("Sign in with", credentials)
		const data = await userStore.login(credentials.value.email, credentials.value.password)
		await router.replace("/")
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message)
		}
	} finally {
		loading.value = false
	}
}
</script>