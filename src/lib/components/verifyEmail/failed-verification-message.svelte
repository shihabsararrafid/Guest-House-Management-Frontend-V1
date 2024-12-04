<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
</script>

<Section classSection="h-96 mt-[100px]">
	<svg
		class="text-red-500 dark:text-red-400 w-11 h-11 mb-3.5 mx-auto"
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
	<p class="mb-4 text-red-600 dark:text-red-400 text-center">
		Email verification failed. Please try again or contact support.
	</p>
	<div class="flex justify-center items-center space-x-4">
		<Button href="/resend-verification" color="red">Resend Verification</Button>
		<Button href="/support" color="light">Contact Support</Button>
	</div>
</Section>
