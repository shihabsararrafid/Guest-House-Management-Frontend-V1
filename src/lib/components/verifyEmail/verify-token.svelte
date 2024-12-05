<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Section } from 'flowbite-svelte-blocks';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let isLoading = true;
	let verificationStatus: 'success' | 'failed' | 'already-verified' | null = null;
	let redirecting = false;

	// Get query parameters
	const token = $page.url.searchParams.get('token');
	const email = $page.url.searchParams.get('email');

	// Function to handle redirection
	async function redirectToLogin() {
		redirecting = true;
		await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before redirecting
		goto('/auth/login'); // Replace with your login route
	}

	// Function to call the API
	async function verifyEmail(token: string | null, email: string | null) {
		if (!token || !email) {
			verificationStatus = 'failed';
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(
				`${PUBLIC_API_URL}/auth/verify-email?email=${email}&token=${token}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({})
				}
			);

			if (response.ok) {
				verificationStatus = 'success';
				redirectToLogin();
			} else if (response.status === 409) {
				verificationStatus = 'already-verified';
				redirectToLogin();
			} else {
				verificationStatus = 'failed';
			}
		} catch (error) {
			console.error('Error verifying email:', error);
			verificationStatus = 'failed';
		} finally {
			isLoading = false;
		}
	}

	// Call the verification function on mount
	onMount(() => {
		verifyEmail(token, email);
	});
</script>

<Section classSection="h-96 mt-[100px] flex items-center justify-center">
	{#if isLoading}
		<div class="flex flex-col items-center">
			<svg
				class="animate-spin text-gray-500 dark:text-gray-300 w-10 h-10 mb-4"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="text-gray-500 dark:text-gray-300 text-center">Verifying email...</p>
		</div>
	{:else if verificationStatus === 'success'}
		<div class="text-center">
			<svg
				class="text-green-500 dark:text-green-400 w-11 h-11 mx-auto mb-4"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.293-5.707a1 1 0 011.414 0L10 12.586l2.879-2.879a1 1 0 111.414 1.414l-3.586 3.586a1 1 0 01-1.414 0L7.707 12.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			<p class="text-green-600 dark:text-green-400">Email verified successfully!</p>
			{#if redirecting}
				<p class="text-gray-500 dark:text-gray-400 mt-2">Redirecting to login...</p>
			{/if}
		</div>
	{:else if verificationStatus === 'already-verified'}
		<div class="text-center">
			<svg
				class="text-blue-500 dark:text-blue-400 w-11 h-11 mx-auto mb-4"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
					clip-rule="evenodd"
				/>
			</svg>
			<p class="text-blue-600 dark:text-blue-400">Email is already verified!</p>
			{#if redirecting}
				<p class="text-gray-500 dark:text-gray-400 mt-2">Redirecting to login...</p>
			{/if}
		</div>
	{:else}
		<div class="text-center">
			<svg
				class="text-red-500 dark:text-red-400 w-11 h-11 mx-auto mb-4"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.516 11.607c.745 1.33-.193 2.994-1.742 2.994H3.483c-1.549 0-2.487-1.664-1.742-2.994L8.257 3.1zm.743 9.901a1 1 0 111-1 1 1 0 01-1 1zm.007-4a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"
					clip-rule="evenodd"
				/>
			</svg>
			<p class="text-red-600 dark:text-red-400">Email verification failed. Please try again.</p>
		</div>
	{/if}
</Section>
