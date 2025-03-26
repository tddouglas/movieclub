<template>
	<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center"
		 :style="{ backgroundImage: `url(${bgImage})` }">
		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-black bg-opacity-50"></div>

		<!-- Login Form Container -->
		<div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
			<!-- Back Button: Display only if a login method is chosen -->
			<button v-if="loginMethod !== null" @click="backToSelection" class="absolute left-4 top-4 p-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<h2 class="text-2xl font-bold text-gray-800 text-center">Login</h2>

			<!-- Initial Choice: Select Login Method -->
			<div v-if="loginMethod === null" class="mt-4">
<!--				TODO: Add Back button to return to login page selection -->
				<MovieClubButton @click="selectMethod('email')" button-text="Login with Email"
						class="w-full mt-4">
				</MovieClubButton>
				<MovieClubButton @click="selectMethod('sms')" button-text="Login with SMS"
						class="w-full mt-4">
				</MovieClubButton>
			</div>

			<!-- Email/Password Form -->
			<form v-if="loginMethod === 'email'" class="mt-4">
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
				<button type="submit" @click.prevent="handleEmailLogin"
						class="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
					Login
				</button>
			</form>

			<!-- SMS Login Flow -->
			<div v-if="loginMethod === 'sms'" class="mt-4">
				<!-- Step 1: Enter Phone Number -->
				<div v-if="smsStep === 1">
					<label class="block text-gray-700">Phone Number</label>
					<input v-model="sms.phone" type="tel" placeholder="555123456"
						   class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black">
					<MovieClubButton @click="requestOtp" button-text="Send OTP"
							class="w-full mt-4">
					</MovieClubButton>
				</div>

				<!-- Step 2: Enter OTP -->
				<div v-else-if="smsStep === 2">
					<label class="block text-gray-700">Enter OTP</label>
					<input v-model="sms.otp" type="text" placeholder="OTP Code"
						   class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black">
					<MovieClubButton @click="verifyOtp" button-text="Verify OTP"
							class="w-full mt-4">
					</MovieClubButton>
				</div>
			</div>

			<!-- Error Message -->
			<div v-if="error" class="text-red-500 mt-4 text-center">
				{{ error }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useUserStore} from '@/stores/user';
import {useRouter} from 'vue-router';
import bgImage from '@/assets/movieclub_entertained.jpeg';
import MovieClubButton from "@/components/MovieClubButton.vue";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const error = ref('');
const loginMethod = ref<string | null>('sms');

// For email/password login
const credentials = ref({
	email: "",
	password: ""
});

// For SMS login
const sms = ref({
	phone: '',
	otp: ''
});
const smsStep = ref(1);

const selectMethod = (method: 'email' | 'sms') => {
	loginMethod.value = method;
	error.value = '';
};

// Email login handler
const handleEmailLogin = async () => {
	error.value = '';
	loading.value = true;
	try {
		await userStore.loginEmail(credentials.value.email, credentials.value.password);
		await router.replace("/");
	} catch (err: any) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

// SMS: Request OTP after validating and formatting phone number
const requestOtp = async () => {
	error.value = '';
	try {
		const formattedPhone = formatPhoneNumber(sms.value.phone);
		await userStore.sendOtp(formattedPhone);
		smsStep.value = 2;
	} catch (err: any) {
		error.value = err.message;
	}
};

// SMS: Verify OTP
const verifyOtp = async () => {
	error.value = '';
	try {
		const formattedPhone = formatPhoneNumber(sms.value.phone);
		await userStore.verifySmsOtp(formattedPhone, sms.value.otp);
		await router.replace("/");
	} catch (err: any) {
		error.value = err.message;
	}
};

// Utility: Validate and format phone number
const formatPhoneNumber = (phone: string): string => {
	// Remove non-digit characters
	const digits = phone.replace(/\D/g, '');
	if (digits.length !== 10) {
		throw new Error('Please provide a valid 10-digit phone number.');
	}
	return `+1${digits}`;
};

// Back button handler resets the selection state and SMS step
const backToSelection = () => {
	loginMethod.value = null;
	smsStep.value = 1;
	error.value = '';
};
</script>
