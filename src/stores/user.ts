import {ref} from "vue"
import {defineStore} from "pinia"
import {supabase} from "@/database/supabaseClient"

export const useUserStore = defineStore("user", () => {
	const authUser = ref()
	const accessToken = ref("")
	const isLoggedIn = ref(false)
	const profile = ref()

	// listen for auth events
	supabase.auth.onAuthStateChange((event, session) => {
		console.log("Auth event:", event)
		authUser.value = session ? session.user : null
		accessToken.value = session ? session.access_token : ""
		isLoggedIn.value = !!authUser.value

		if (authUser.value) {
			loadUserProfile()
		} else {
			profile.value = null
		}
	})

	// Function to load session on app start
	const loadUserSession = async () => {
		const {data, error} = await supabase.auth.getSession()
		if (error) {
			console.error("Error getting session:", error)
			return
		}
		if (data.session) {
			authUser.value = data.session.user
			accessToken.value = data.session.access_token
			isLoggedIn.value = !!authUser.value
			await loadUserProfile()
		}
	}

	// Function to load the full user profile from the 'users' table using the user's id
	async function loadUserProfile() {
		if (authUser.value && authUser.value.id) {
			const {data, error} = await supabase
				.from('users')
				.select('*')
				.eq('id', authUser.value.id)
				.single()
			if (error) {
				console.error("Error loading user profile:", error)
				return
			}
			profile.value = data
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
			await loadUserProfile()
		}
		return data
	}

	async function logout() {
		console.log("Signing out")
		authUser.value = null
		accessToken.value = ""
		profile.value = null
		return await supabase.auth.signOut()
	}

	return {
		user: authUser,
		accessToken,
		isLoggedIn,
		profile,
		loadUserSession,
		createAccount,
		login,
		logout
	}
})
