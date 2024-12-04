<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
</script>

<Section classSection="h-96 mt-[100px]">
	<svg
		class="text-blue-500 dark:text-blue-400 w-11 h-11 mb-3.5 mx-auto"
		aria-hidden="true"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.94 4.5A2.5 2.5 0 015.42 3h9.16a2.5 2.5 0 012.48 1.5l-7.07 4.42a.75.75 0 01-.78 0L2.94 4.5zm7.07 6.42L18 6.26v7.74A2.5 2.5 0 0115.5 16h-11A2.5 2.5 0 012 14V6.26l8 4.66z"
		/>
	</svg>

	<p class="mb-4 text-gray-500 dark:text-gray-300 text-center">
		We have sent an email for verification. Please complete verification within 24 hours.
	</p>
	<div class="flex justify-center items-center space-x-4">
		<Button href="https://mail.google.com/mail/u/0/#inbox" color="light">Open Gmail</Button>
	</div>
</Section>
