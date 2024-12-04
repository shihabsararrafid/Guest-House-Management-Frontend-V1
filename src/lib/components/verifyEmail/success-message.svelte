<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
</script>

<Section classSection="h-96 mt-[100px]">
	<svg
		class="text-green-500 dark:text-green-400 w-11 h-11 mb-3.5 mx-auto"
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
	<p class="mb-4 text-green-600 dark:text-green-400 text-center">
		Your email has been successfully verified. Thank you!
	</p>
	<div class="flex justify-center items-center space-x-4">
		<Button href="/" color="blue">Go to Dashboard</Button>
	</div>
</Section>
