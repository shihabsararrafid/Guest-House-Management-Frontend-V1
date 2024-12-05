<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { CircleMinusOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount, SvelteComponent } from 'svelte';
	import { writable } from 'svelte/store';

	let clickOutsideModal = false;
	let buttonElement: HTMLElement;
	let modalElement: HTMLElement;
	let top = 0;
	let buttonBottom = 0;
	let left = 0;

	const dispatch = createEventDispatcher();

	function openModal() {
		clickOutsideModal = true;
		setTimeout(positionModal, 0);
	}

	function positionModal() {
		if (buttonElement && modalElement) {
			const buttonRect = buttonElement.getBoundingClientRect();
			const modalRect = modalElement.getBoundingClientRect();

			top = buttonRect.bottom + window.scrollY;
			left = buttonRect.left + window.scrollX;

			// Ensure the modal doesn't go off-screen
			if (left + modalRect.width > window.innerWidth) {
				left = window.innerWidth - modalRect.width;
			}

			modalElement.style.top = `${top}px`;
			modalElement.style.left = `${left}px`;
		}
	}

	function handleClose() {
		clickOutsideModal = false;
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			openModal();
		}
	}

	onMount(() => {
		window.addEventListener('resize', positionModal);
		return () => {
			window.removeEventListener('resize', positionModal);
		};
	});
	interface Room {
		id: number;
		adults: number;
		children: number;
		childAges: number[];
		isExpanded: boolean;
	}

	export let rooms = writable<Room[]>([
		{ id: 1, adults: 1, children: 0, childAges: [], isExpanded: true }
	]);

	let nextRoomId = 2;

	function addRoom() {
		rooms.update((r) => [
			...r.map((rm) => ({ ...rm, isExpanded: false })),
			{ id: nextRoomId++, adults: 1, children: 0, childAges: [], isExpanded: true }
		]);
	}

	function removeRoom(id: number) {
		rooms.update((r) => r.filter((room) => room.id !== id));
	}

	function updateAdults(roomId: number, delta: number) {
		console.log('come here');
		rooms.update((r) =>
			r.map((room) =>
				room.id === roomId
					? { ...room, adults: Math.max(1, Math.min(room.adults + delta, 4)) }
					: room
			)
		);
	}

	function updateChildren(roomId: number, delta: number) {
		rooms.update((r) =>
			r.map((room) => {
				if (room.id === roomId) {
					const newChildren = Math.max(0, Math.min(room.children + delta, 2));
					const newChildAges = room.childAges.slice(0, newChildren);
					while (newChildAges.length < newChildren) {
						newChildAges.push(2);
					}
					return { ...room, children: newChildren, childAges: newChildAges };
				}
				return room;
			})
		);
	}

	function updateChildAge(roomId: number, childIndex: number, age: number) {
		rooms.update((r) =>
			r.map((room) =>
				room.id === roomId
					? { ...room, childAges: room.childAges.map((a, i) => (i === childIndex ? age : a)) }
					: room
			)
		);
	}
	function updateRoomExpansionStatus(roomId: number) {
		rooms.update((r) =>
			r.map((room) =>
				room.id === roomId ? { ...room, isExpanded: true } : { ...room, isExpanded: false }
			)
		);
	}
	$: totalGuests = $rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
	$: totalRooms = $rooms.length;
	$: {
		// top = buttonBottom + window?.scrollY ?? 0;
		// console.log(top, 'top posssiition');
	}
</script>

<div class="relative">
	<button
		type="button"
		bind:this={buttonElement}
		on:click={openModal}
		on:keydown={handleKeydown}
		class="border-bg-blue-100 w-full cursor-pointer hover:bg-blue-100 border-[1px] px-3 py-2 rounded-md inline-block text-left"
		aria-haspopup="dialog"
		aria-expanded={clickOutsideModal}
	>
		<p class="text-xs text-blue-400 font-semibold">ROOMS & GUESTS</p>
		<p class="text-xs">
			<span class="text-sm">{$rooms.length}</span> Room <span class="text-sm"> {totalGuests} </span>
			Guest(s)
		</p>
		<p class="text-xs">{$rooms.reduce((s, room) => room.adults + s, 0)} Adult(s)</p>
	</button>
	{#if clickOutsideModal}
		<div
			bind:this={modalElement}
			class=" z-50 w-[400px] max-w-2xl overflow-y-auto overflow-x-hidden p-2"
		>
			<div class="relative max-h-full w-full">
				<div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
					<div class="flex items-start justify-between rounded-t border-b p-2 dark:border-gray-600">
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Rooms & Guests</h3>
						<button
							type="button"
							on:click={handleClose}
							class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<svg
								class="h-3 w-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<div class="room-selection p-2 bg-white rounded-lg shadow">
						{#each $rooms as room (room.id)}
							<div
								tabindex={0}
								role="button"
								on:keypress={() => updateRoomExpansionStatus(room.id)}
								on:click={() => updateRoomExpansionStatus(room.id)}
								class={`room mb-4 p-2 border border-gray-200 rounded ${!room.isExpanded ? 'cursor-pointer' : ''}`}
							>
								<div class="flex justify-between items-center mb-2">
									<h3 class="text-md font-bold">Room {room.id}</h3>
									{#if $rooms.length > 1}
										<button
											on:click={() => removeRoom(room.id)}
											class="text-blue-600 hover:underline">Remove</button
										>
									{/if}
								</div>
								{#if room.isExpanded}
									<div class="mb-2 flex text-sm justify-between text-black">
										<div>
											<span class="">Adults</span> <br />
											<p class="inline-block">10+ years</p>
										</div>
										<div class="flex items-center">
											<Button
												pill={true}
												outline={true}
												class="!p-2 border-none hover:bg-transparent focus:border-none focus-within:ring-0"
												size="xl"
												on:click={() => updateAdults(room.id, -1)}
											>
												<CircleMinusOutline class="w-6 h-6 text-black" />
											</Button>

											<span class="mx-2">{room.adults}</span>
											<Button
												pill={true}
												outline={true}
												class="!p-2 border-none hover:bg-transparent focus:border-none focus-within:ring-0"
												size="xl"
												on:click={() => updateAdults(room.id, 1)}
											>
												<CirclePlusOutline class="w-6 h-6 text-black" />
											</Button>
										</div>
									</div>

									<div class="mb-2 flex text-sm justify-between text-black">
										<div>
											<span class="">Children </span>
											<br />
											<span>(0-10 years)</span>
										</div>
										<div class="flex items-center">
											<Button
												pill={true}
												outline={true}
												class="!p-2 border-none hover:bg-transparent focus:border-none focus-within:ring-0"
												size="xl"
												on:click={() => updateChildren(room.id, -1)}
											>
												<CircleMinusOutline class="w-6 h-6 text-black" />
											</Button>

											<span class="mx-2">{room.children}</span>
											<Button
												pill={true}
												outline={true}
												class="!p-2 border-none hover:bg-transparent focus:border-none focus-within:ring-0"
												size="xl"
												on:click={() => updateChildren(room.id, 1)}
											>
												<CirclePlusOutline class="w-6 h-6 text-black" />
											</Button>
										</div>
									</div>
								{:else}
									<p>{room.adults} Adults {room.children > 0 ? ` , ${room.children} Child` : ''}</p>
								{/if}
							</div>
						{/each}
					</div>

					<div class="mt-2 px-3 text-sm">
						{totalRooms}
						{totalRooms === 1 ? 'Room' : 'Rooms'}, {totalGuests} Guests
					</div>
					<div
						class="flex justify-between items-center space-x-2 rounded-b border-t border-gray-200 px-1 py-3 dark:border-gray-600"
					>
						<button
							type="button"
							on:click={addRoom}
							class="rounded-lg border focus-within:ring-0 border-gray-400 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Add Another Room
						</button>
						<button
							type="button"
							on:click={handleClose}
							class="rounded-lg bg-yellow-300 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Done
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
