<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-900">
		<div class="w-9/12 lg:w-1/2 text-center p-8 bg-black/50 rounded-lg shadow-lg">
			<img src="@/assets/404_wombat.png" alt="404 Wombat" class="mx-auto w-96 h-96 object-contain"/>
			<h1 class="text-4xl font-bold text-white mt-8">👷‍♂🔨️- Building Underway</h1>
			<p class="text-gray-300 mt-2">Oops! This page is still under construction. Check back later for some
				cool new stuff.</p>
			<router-link to="/"
						 class="mt-8 inline-block px-6 py-2 text-md font-medium text-white rounded-lg bg-gray-700 hover:bg-blue-500 transition">
				Go Home
			</router-link>
		</div>
	</div>
</template>
