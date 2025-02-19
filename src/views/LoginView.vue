<template>
	<div class="mt-8 w-96 md:w-auto">
		<fwb-heading tag="h1" class="mb-4 text-center">Log In </fwb-heading>
		<form class="flex flex-col items-center" @submit.prevent="handleLogin">
			<div>
				<div class="w-96 md:w-[26rem]">
					<fwb-input
						v-model="credentials.email"
						placeholder="enter your email"
						class="my-2"
						required
					/>
					<fwb-input
						v-model="credentials.password"
						placeholder="enter your password"
						class="my-2"
						required
					/>
				</div>
			</div>
			<div>
				<fwb-button
					class="w-44"
					color="alternative"
					value="This is the v"
					:disabled="loading"
					:loading="loading"
					@click="handleLogin"
					>{{ loading ? "" : "Log In" }}
				</fwb-button>
			</div>
		</form>
		<div class="text-center">
			<p class="mb-2 mt-6">Don't have an account?</p>
			<router-link to="signup">
				<fwb-button gradient="purple-blue">Sign up now</fwb-button>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"
import { FwbButton, FwbHeading, FwbInput } from "flowbite-vue"

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
		const {data, error} = await userStore.login(credentials.value.email, credentials.value.password)
		if (error) throw error
		console.log("user logged in", data.user.email)
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