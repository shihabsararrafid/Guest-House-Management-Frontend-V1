<script lang="ts">
	import { Card } from 'flowbite-svelte';
</script>

<div class="space-y-4">
	{#each Array(3) as _}
		<Card class="animate-pulse">
			<div class="flex justify-between">
				<div class="h-4 bg-gray-200 rounded w-1/4"></div>
				<div class="h-4 bg-gray-200 rounded w-1/4"></div>
			</div>
			<div class="space-y-3 mt-4">
				<div class="h-3 bg-gray-200 rounded w-3/4"></div>
				<div class="h-3 bg-gray-200 rounded w-1/2"></div>
				<div class="grid grid-cols-4 gap-2">
					{#each Array(4) as _}
						<div class="h-3 bg-gray-200 rounded"></div>
					{/each}
				</div>
			</div>
		</Card>
	{/each}
</div>
