import {ref} from "vue"
import {defineStore} from "pinia"
import {supabase} from "@/database/supabaseClient"

export const useUserStore = defineStore("user", () => {
	const user = ref()
	const accessToken = ref("")
	const isLoggedIn = ref(false)

	// listen for auth events
	supabase.auth.onAuthStateChange((event, session) => {
		console.log("Auth event:", event)
		user.value = session ? session.user : null
		accessToken.value = session ? session.access_token : ""
		isLoggedIn.value = !!user.value
	})

	// Function to load session on app start
	const loadUserSession = async () => {
		const {data, error} = await supabase.auth.getSession()
		if (error) {
			console.error("Error getting session:", error)
			return
		}
		if (data.session) {
			user.value = data.session.user
			accessToken.value = data.session.access_token
			isLoggedIn.value = !!user.value
		}
	}

	async function createAccount(
		email: string,
		password: string,
		displayName?: string
	) {
		return await supabase.auth.signUp({
			email,
			password
		})
	}

	async function login(email: string, password: string) {
		console.log("Logging in user")
		const {data, error} = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Login Error:", error.message);
		} else {
			console.log("user logged in", data)
		}
		return data
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
		loadUserSession,
		createAccount,
		login,
		logout
	}
})
