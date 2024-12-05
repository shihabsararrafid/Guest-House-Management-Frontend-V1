<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { HeroHeader, News } from 'flowbite-svelte-blocks';
	import { AddressBookSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
	import DatePicker from '../DatePicker/DatePicker.svelte';
	import SearchRoom from './SearchRoom.svelte';
	import { get, writable } from 'svelte/store';
	import RoomSkeleton from '../Rooms/RoomSkeleton.svelte';
	import AvailableRooms from '../Rooms/AvailableRooms.svelte';
	import type { ResponseRoom } from '$lib/types/Rooms';
	import { goto } from '$app/navigation';
	let checkIn = '';
	let checkOut = '';
	let isLoading = false;
	let availableRooms: ResponseRoom[] = [];
	let error = '';

	interface Room {
		id: number;
		adults: number;
		children: number;
		childAges: number[];
		isExpanded: boolean;
	}
	let rooms = writable<Room[]>([
		{ id: 1, adults: 1, children: 0, childAges: [], isExpanded: true }
	]);
	const searchAvailableRooms = async () => {
		if (!checkIn || !checkOut) {
			// You might want to show an error message here
			return;
		}

		const roomsData = get(rooms);
		const totalCapacity = roomsData.reduce((sum, room) => sum + room.adults + room.children, 0);

		const params = new URLSearchParams({
			checkIn,
			checkOut,
			capacity: JSON.stringify([1, totalCapacity])
		});

		// Redirect to the available rooms page with search parameters
		await goto(`/available-rooms?${params.toString()}`);
	};
</script>

<div
	class="min-h-screen w-full flex flex-col justify-between bg-cover bg-center"
	style="background-image: url('/ruet_guest_house.jpg'); opacity: 10;"
>
	<div
		class="bg-black flex justify-center items-center mt-[80px] bg-opacity-10 min-h-screen text-white py-8"
	>
		<div>
			<div class="flex justify-center my-10">
				<News class="mx-auto">
					<span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
					<span class="text-sm font-medium">Online booking now available!</span>
				</News>
			</div>
			<HeroHeader>
				<h1 class="text-6xl font-bold text-center">Welcome to University Guest House</h1>
				<p class=" text-lg my-5 font-semibold">
					Experience comfortable and convenient accommodation right on campus. Our guest house
					offers a perfect blend of academic atmosphere and modern amenities for visitors, faculty,
					and alumni.
				</p>
			</HeroHeader>

			<div
				class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
			>
				<a href="/">
					<Button size="lg" color="red">
						See Pricing <ArrowRightOutline size="lg" class="ml-2 -mr-1" />
					</Button>
				</a>
				<a href="/">
					<Button size="lg" color="light">
						<AddressBookSolid size="lg" class="mr-2 -ml-1" />
						Contact Us
					</Button>
				</a>
			</div>
			<Card class="lg:w-1/2 py-3 relative max-w-4xl mx-auto mb-8">
				<form class="flex flex-col mb-10 md:flex-row gap-4">
					<div class="grow">
						<DatePicker bind:inputTxt={checkIn} label="Check In" />
					</div>
					<div class="grow">
						<DatePicker bind:inputTxt={checkOut} label="Check Out" />
					</div>
					<div class="grow">
						<SearchRoom bind:rooms />
					</div>
				</form>
				{#if error}
					<p class="text-red-500 text-sm mt-2">{error}</p>
				{/if}
				<div class="flex items-end absolute -bottom-5 left-1/2 transform -translate-x-1/2">
					<Button
						on:click={searchAvailableRooms}
						color="yellow"
						class="w-[120px]"
						disabled={isLoading}
					>
						{isLoading ? 'Searching...' : 'Search'}
					</Button>
				</div>
			</Card>
		</div>
	</div>

	<div class="mt-8 lg:w-1/2 mx-auto">
		{#if isLoading}
			<RoomSkeleton />
		{:else if availableRooms.length > 0}
			<AvailableRooms bind:rooms={availableRooms} />
		{/if}
	</div>
</div>
