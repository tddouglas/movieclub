import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import LoginView from "@/views/LoginView.vue"
import {useUserStore} from "@/stores/user"


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/signup",
			name: "signup",
			component: () => import("@/views/SignUpView.vue"),
		},
		{
			path: '/',
			name: 'home',
			component: Home,
			meta: {requiresAuth: true}
		},
		{
			path: '/nominations',
			name: 'nominations',
			component: () => import("@/views/Nominations.vue"),
			meta: {requiresAuth: true}
		},
		{
			path: '/club-history',
			name: 'club-history',
			component: () => import("@/views/ClubHistory.vue"),
			meta: {requiresAuth: true, workInProgress: true}
		},
		{
			path: '/members',
			name: 'members',
			component: () => import("@/views/ClubMembers.vue"),
			meta: {requiresAuth: true, workInProgress: true}
		},
		{
			path: '/schedule',
			name: 'schedule',
			component: () => import("@/views/MeetingSchedule.vue"),
			meta: {requiresAuth: true, workInProgress: true}
		},
		{
			path: '/under-construction',
			name: 'under-construction',
			component: () => import("@/views/NotFound.vue")
		}
	]
})

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore()

	// Ensure we wait for session to be retrieved
	if (!userStore.isLoggedIn) {
		await userStore.loadUserSession() // Load session if not yet set
	}

	console.log("router guard checking is logged in:", userStore.isLoggedIn)
	if (to.meta.requiresAuth && !userStore.isLoggedIn) {
		// this route requires auth, check if logged in
		next({name: "login"})
	} else {
		next()
		// if (to.meta.workInProgress) {
		// 	next({name: "under-construction"})
		// } else  {
		// 	next()
		// }
	}
})

export default router