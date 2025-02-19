import { ref } from "vue"
import { defineStore } from "pinia"
import { supabase } from "@/database/supabaseClient"

export const useUserStore = defineStore("user", () => {
	const user = ref()
	const accessToken = ref("")
	const isLoggedIn = ref(false)

	// listen for auth events
	supabase.auth.onAuthStateChange((event, session) => {
		user.value = session ? session.user : null
		accessToken.value = session ? session.access_token : ""
		isLoggedIn.value = !!user.value
	})

	async function initialized() {
		if (user.value) return true
		else {
			console.log("calling supabase to get user status")
			const { data, error } = await supabase.auth.getUser()
			if (error) return null
			else return !!data.user
		}
	}

	async function createAccount(
		email: string,
		password: string,
		firstName?: string,
		lastName?: string
	) {
		return await supabase.auth.signUp({
			email,
			password
		})
	}
	async function login(email: string, password: string) {
		return await supabase.auth.signInWithPassword({
			email,
			password
		})
	}

	async function logout() {
		console.log("Signing out")
		user.value = null
		accessToken.value = ""
		return await supabase.auth.signOut()
	}

	return {
		user,
		accessToken,
		isLoggedIn,
		initialized,
		createAccount,
		login,
		logout
	}
})
