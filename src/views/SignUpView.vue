<template>
	<div class="w-96 md:w-auto mt-8">
		<h2 class="text-center mb-4"
		>Sign Up Page
		</h2>
		<form class="flex flex-col items-center" @submit.prevent="handleSignUp">
			<div>
				<p class="text-center">
					Enter your desired username and password below
				</p>
				<div class="w-96 md:w-[26rem]">
					<input
						v-model="credentials.email"
						placeholder="enter your email"
						class="my-2"
						required
					/>
					<input
						v-model="credentials.password"
						placeholder="enter your password"
						class="my-2"
						required
					/>
				</div>
			</div>
			<div>
				<button
					class="w-44"
					value="This is the v"
					:disabled="loading"
					@click="handleSignUp"
				>{{ loading ? "" : "Sign Up" }}
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {useUserStore} from "@/stores/user"
import {useRouter} from "vue-router"

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const credentials = ref({
	email: "",
	password: ""
})
const handleSignUp = async () => {
	try {
		loading.value = true
		console.log("Sign up with", credentials)
		const {data, error} = await userStore.createAccount(
			credentials.value.email,
			credentials.value.password
		)
		if (error) throw error
		console.log("user logged in", data?.user?.email)
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
