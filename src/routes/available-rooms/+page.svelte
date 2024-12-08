<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button, Card, Badge, Toggle } from 'flowbite-svelte';
	import { LucideLollipop, XCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL } from '$env/static/public';
	import dayjs from 'dayjs';

	interface Room {
		id: string;
		roomNumber: string;
		roomName: string | null;
		type: string;
		status: string;
		floor: number;
		capacity: number;
		pricePerNight: number;
		description: string;
		hasWifi: boolean;
		hasAC: boolean;
		hasTv: boolean;
		hasRefrigerator: boolean;
		squareFootage: number;
		viewType: string;
		isAvailable: boolean;
	}

	interface BookingRoom {
		room: Room;
		adults: number;
		children: number;
	}
	interface BookingResponse {
		message: string;
		data: {
			id: string;
			guestId: string;
			checkIn: string;
			checkOut: string;
			totalPrice: number;
			totalPriceWithDiscount: number;
			discount: number;
			discountType: string;
			status: string;
			isPaid: boolean;
			paymentDate: string | null;
			paidAmount: number;
			bookedMoney: number;
			createdAt: string;
			updatedAt: string;
			rooms: BookingRoomResponse[];
		};
	}

	interface BookingRoomResponse {
		bookingId: string;
		roomId: string;
		pricePerNight: number;
		numberOfGuests: number;
		specialRequests: string | null;
		createdAt: string;
		room: Room;
	}

	interface BookingRequest {
		checkIn: string;
		checkOut: string;
		rooms: {
			id: string;
			numberOfGuests: number;
			pricePerNight: number;
		}[];
	}

	let processing = false;

	let isLoading = true;
	let rooms: Room[] = [];
	let error = '';
	let showBookingPanel = false;
	let selectedRooms: BookingRoom[] = [];
	let requiredRooms = 1;
	let checkIn = '';
	let checkOut = '';
	let payFull = true;

	onMount(async () => {
		try {
			const searchParams = $page.url.searchParams;
			checkIn = searchParams.get('checkIn') || '';
			checkOut = searchParams.get('checkOut') || '';
			const capacityParam = searchParams.get('capacity') || '[]';
			const totalRooms = searchParams.get('totalRooms');
			const capacityArray = JSON.parse(capacityParam);
			console.log(capacityArray, 'ad');
			requiredRooms = parseInt(totalRooms ?? '1');

			const response = await fetch(`${PUBLIC_API_URL}/booking/get-available-rooms?${searchParams}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message ?? 'Failed to fetch available rooms');
			}

			rooms = data.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while fetching rooms';
		} finally {
			isLoading = false;
		}
	});

	function selectRoom(room: Room) {
		if (selectedRooms.length < requiredRooms) {
			selectedRooms = [
				...selectedRooms,
				{
					room,
					adults: 1,
					children: 0
				}
			];
		}
		showBookingPanel = true;
	}

	function removeRoom(index: number) {
		selectedRooms = selectedRooms.filter((_, i) => i !== index);
		if (selectedRooms.length === 0) {
			showBookingPanel = false;
		}
	}

	function calculateTotalPrice() {
		const checkInDate = new Date(checkIn);
		const checkOutDate = new Date(checkOut);
		const nights = Math.ceil(
			(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
		);
		return selectedRooms.reduce((total, booking) => total + booking.room.pricePerNight * nights, 0);
	}
	async function handleBookingConfirmation() {
		try {
			processing = true;

			// Format dates to match API expectations (MM-DD-YYYY)
			const formattedCheckIn = new Date(checkIn)
				.toLocaleDateString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: 'numeric'
				})
				.replace(/\//g, '-');

			const formattedCheckOut = new Date(checkOut)
				.toLocaleDateString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: 'numeric'
				})
				.replace(/\//g, '-');

			const bookingData: BookingRequest = {
				checkIn: formattedCheckIn,
				checkOut: formattedCheckOut,
				rooms: selectedRooms.map((booking) => ({
					id: booking.room.id,
					numberOfGuests: booking.adults + booking.children,
					pricePerNight: booking.room.pricePerNight
				}))
			};

			const response = await fetch(`${PUBLIC_API_URL}/booking/book-rooms`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				body: JSON.stringify(bookingData),
				credentials: 'include'
			});

			const result: BookingResponse = await response.json();

			if (!response.ok) {
				if (response.status === 401) {
					// Redirect to login page with return URL
					const currentPath = window.location.pathname + window.location.search;
					await goto(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`);
					return;
				}

				error = (result as any).error.message || `Failed to confirm booking`;
				throw new Error((result as any).error.message || 'Failed to confirm booking');
			}

			// Store booking info in cookie
			const d = {
				amount: payFull ? result.data.totalPrice : result.data.totalPrice * 0.2,
				currency: 'bdt'
			};
			if (browser) {
				const bookingInfo = {
					bookingId: result.data.id,
					totalAmount: result.data.totalPrice,
					rooms: result.data.rooms.map((room) => ({
						roomNumber: room.room.roomNumber,
						type: room.room.type,
						numberOfGuests: room.numberOfGuests,
						pricePerNight: room.pricePerNight
					})),
					checkIn: result.data.checkIn,
					checkOut: result.data.checkOut,
					payment: d
				};

				document.cookie = `bookingInfo=${JSON.stringify(bookingInfo)}; path=/; max-age=3600; Secure; SameSite=Strict`;
			}

			const response1 = await fetch(`${PUBLIC_API_URL}/payment/make-payment/${result.data.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				body: JSON.stringify(d),
				credentials: 'include'
			});
			const result1 = await response1.json();
			if (response1.ok)
				await goto(
					`/checkout?booking=${result.data.id}&client-secret=${result1.data.client_secret}&paymentId=${result1.data.id}`
				);
			else throw new Error('Booking Successful  but payment unsuccessful . Contact with support');

			// Redirect to checkout
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process booking';
		} finally {
			processing = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 mt-[100px] flex gap-6">
	<div class="flex-1">
		<h1 class="text-3xl font-bold mb-6">Available Rooms</h1>

		{#if isLoading}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(10) as _}
					<Card class="animate-pulse">
						<div class="h-32 bg-gray-200 rounded" />
					</Card>
				{/each}
			</div>
		{:else if error}
			<Card class="bg-red-50">
				<p class="text-red-500">{error}</p>
			</Card>
		{:else if rooms.length === 0}
			<Card>
				<p class="text-center text-gray-600">No rooms available for the selected dates</p>
			</Card>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each rooms as room (room.id)}
					<Card>
						<div class="flex justify-between">
							<h3 class="text-xl font-semibold">Room {room.roomNumber}</h3>
							<p class="text-lg font-bold">${room.pricePerNight}/night</p>
						</div>
						<p class="text-gray-600 mt-2">{room.type} - {room.viewType} View</p>
						<p class="mt-2">{room.description}</p>

						<div class="mt-4 flex gap-2 text-sm">
							{#if room.hasWifi}
								<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">WiFi</span>
							{/if}
							{#if room.hasAC}
								<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">AC</span>
							{/if}
							{#if room.hasTv}
								<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">TV</span>
							{/if}
							{#if room.hasRefrigerator}
								<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">Fridge</span>
							{/if}
						</div>

						<div class="mt-4">
							<Button
								class="w-full"
								on:click={() => selectRoom(room)}
								disabled={selectedRooms.length >= requiredRooms ||
									selectedRooms.some((booking) => booking.room.id === room.id)}
							>
								{selectedRooms.some((booking) => booking.room.id === room.id)
									? 'Selected'
									: 'Select Room'}
							</Button>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>

	{#if showBookingPanel}
		<div class="w-[400px] sticky top-[100px] h-fit">
			<Card>
				<h2 class="text-xl font-bold mb-4">Your Booking Summary</h2>
				<div class="mb-4">
					<p class="text-sm text-gray-600">
						Check-in: {dayjs(new Date(checkIn).toLocaleDateString())
							.add(12, 'hour')
							.format('DD MMM YYYY hh:mm a')}
					</p>
					<p class="text-sm text-gray-600">
						Check-out: {dayjs(new Date(checkOut).toLocaleDateString())
							.add(11, 'hour')
							.format('DD MMM YYYY hh:mm a')}
					</p>
				</div>

				<div class="space-y-4">
					{#each selectedRooms as booking, index}
						<div class="border p-3 rounded-lg relative">
							<button class="absolute top-2 right-2" on:click={() => removeRoom(index)}>
								<XCircle class="w-5 h-5 text-gray-400 hover:text-red-500" />
							</button>
							<h3 class="font-semibold">Room {booking.room.roomNumber}</h3>
							<p class="text-sm text-gray-600">
								{booking.room.type} - ${booking.room.pricePerNight}/night
							</p>
							<div class="flex">
								<div class="mt-2">
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<label class="block text-sm font-medium text-gray-700">Adults</label>
									<input
										type="number"
										min="1"
										max="4"
										bind:value={booking.adults}
										class="mt-1 block w-20 rounded-md border-gray-300 shadow-sm"
									/>
								</div>
								<div class="mt-2">
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<label class="block text-sm font-medium text-gray-700">Children</label>
									<input
										type="number"
										min="0"
										max="2"
										bind:value={booking.children}
										class="mt-1 block w-20 rounded-md border-gray-300 shadow-sm"
									/>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if selectedRooms.length < requiredRooms}
					<div class="mt-4 p-3 bg-yellow-50 rounded-lg">
						<p class="text-sm text-yellow-800">
							Please select {requiredRooms - selectedRooms.length} more room(s)
						</p>
					</div>
				{/if}

				<div class="mt-4 border-t pt-4">
					<div class="flex justify-between font-bold">
						<span>Total Price:</span>
						<span>{calculateTotalPrice()} BDT</span>
					</div>
					<div class="flex justify-between font-bold">
						<span>Booking Money:</span>
						<span>{calculateTotalPrice() * 0.2} BDT</span>
					</div>
					<div class="flex justify-between font-bold">
						<span>You will pay:</span>
						<span>{payFull ? calculateTotalPrice() : calculateTotalPrice() * 0.2} BDT</span>
					</div>
					<Toggle bind:checked={payFull}>Pay Full</Toggle>
				</div>

				<Button
					class="w-full mt-4"
					disabled={selectedRooms.length < requiredRooms || processing}
					on:click={handleBookingConfirmation}
				>
					{#if processing}
						<div class="flex items-center justify-center">
							<div
								class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
							></div>
							Processing...
						</div>
					{:else}
						Proceed to Booking
					{/if}
				</Button>

				{#if error}
					<div class="mt-4 p-3 bg-red-50 rounded-lg">
						<p class="text-sm text-red-600">{error}</p>
					</div>
				{/if}
			</Card>
		</div>
	{/if}
</div>
