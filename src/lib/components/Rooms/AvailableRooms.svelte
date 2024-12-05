<script lang="ts">
	import type { ResponseRoom } from '$lib/types/Rooms';
	import { Card } from 'flowbite-svelte';
	import { Wifi, Tv, Wind, Refrigerator } from 'lucide-svelte';

	export let rooms: ResponseRoom[] = [];
</script>

{#if rooms.length > 0}
	<div class="space-y-4">
		{#each rooms as room (room.id)}
			<Card>
				<div class="flex justify-between items-start">
					<div>
						<h3 class="text-lg font-semibold">Room {room.roomNumber}</h3>
						<p class="text-sm text-gray-600">{room.type} - {room.viewType} View</p>
					</div>
					<div class="text-right">
						<p class="text-lg font-bold">${room.pricePerNight}</p>
						<p class="text-sm text-gray-600">per night</p>
					</div>
				</div>
				<p class="mt-2 text-gray-700">{room.description}</p>
				<div class="mt-3 flex gap-4">
					{#if room.hasWifi}
						<Wifi class="w-5 h-5 text-gray-600" />
					{/if}
					{#if room.hasAC}
						<Wind class="w-5 h-5 text-gray-600" />
					{/if}
					{#if room.hasTv}
						<Tv class="w-5 h-5 text-gray-600" />
					{/if}
					{#if room.hasRefrigerator}
						<Refrigerator class="w-5 h-5 text-gray-600" />
					{/if}
				</div>
				<div class="mt-3 text-sm text-gray-600">
					<span>{room.squareFootage} sq ft</span> •
					<span>Floor {room.floor}</span> •
					<span>Capacity: {room.capacity} persons</span>
				</div>
			</Card>
		{/each}
	</div>
{:else}
	<Card>
		<p class="text-center text-gray-600">No rooms available for the selected dates</p>
	</Card>
{/if}
