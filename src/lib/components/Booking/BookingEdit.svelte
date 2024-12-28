<!-- BookingEdit.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	// import type {
	// 	Booking,
	// 	Room,
	// 	PaymentTransaction,
	// 	BookingStatus,
	// 	PaymentStatus
	// } from '@prisma/client';
	import { enhance } from '$app/forms';
	import type { Booking, BookingStatus, Transaction } from '$lib/types/Booking';
	import { RoomType, type Room } from '$lib/types/Rooms';
	import { Label } from 'flowbite-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	export let bookingId: string;
	enum BookingStatus {
		PENDING = 'PENDING',
		CONFIRMED = 'CONFIRMED',
		CANCELLED = 'CANCELLED',
		ON_GOING = 'ON_GOING',
		COMPLETED = 'COMPLETED'
	}

	enum PaymentStatus {
		PENDING = 'PENDING',
		PROCESSING = 'PROCESSING',
		COMPLETED = 'COMPLETED',
		FAILED = 'FAILED',
		REFUNDED = 'REFUNDED',
		CANCELED = 'CANCELED'
	}

	let booking: Booking;
	let rooms: Room[] = [];
	let availableRooms: Room[] = [];
	let transaction: Transaction;
	let loading = false;
	let error: string | null = null;

	const bookingStatuses = Object.values(BookingStatus);
	const paymentStatuses = Object.values(PaymentStatus);

	onMount(async () => {
		try {
			const [bookingRes, roomsRes] = await Promise.all([
				fetch(`${PUBLIC_API_URL}/booking/${bookingId}`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					// body: JSON.stringify(newRoom),
					credentials: 'include',
					method: 'GET'
				}),
				fetch(`${PUBLIC_API_URL}/room/get-all-rooms`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					// body: JSON.stringify(newRoom),
					credentials: 'include',
					method: 'GET'
				})
			]);

			if (!bookingRes.ok || !roomsRes.ok) throw new Error('Failed to fetch data');
			// console.log((await bookingRes.json())?.data);
			booking = (await bookingRes.json())?.data;
			rooms = (await roomsRes.json())?.data;
			console.log(booking, rooms);
			// // Get transaction
			// const transactionRes = await fetch(`/api/transactions?bookingId=${bookingId}`);
			// if (!transactionRes.ok) throw new Error('Failed to fetch transaction');
			// transaction = await transactionRes.json();

			// Filter available rooms based on date range
			// availableRooms = rooms.filter(
			// 	(room) => room.status === 'AVAILABLE' || booking.rooms.some((br) => br.roomId === room.id)
			// );
			availableRooms = rooms;
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown Error Occurred';
			loading = false;
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;

		try {
			// Update booking
			const bookingRes = await fetch(`/api/bookings/${bookingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(booking)
			});

			if (!bookingRes.ok) throw new Error('Failed to update booking');

			// Update transaction
			const transactionRes = await fetch(`/api/transactions/${transaction.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(transaction)
			});

			if (!transactionRes.ok) throw new Error('Failed to update transaction');

			// Show success message or redirect
			window.location.href = '/bookings';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown Error Occurred';
		} finally {
			loading = false;
		}
	}
	const dummyData = {
		rooms: [
			{
				// id: 'room1',
				roomNumber: '101',
				type: RoomType.SINGLE,
				isAvailable: true,
				pricePerNight: 100
			},
			{
				// id: 'room2',
				roomNumber: '102',
				type: RoomType.DOUBLE,
				isAvailable: true,
				pricePerNight: 150
			},
			{
				// id: 'room3',
				roomNumber: '103',
				type: RoomType.SUITE,
				isAvailable: false,
				pricePerNight: 300
			}
		] as unknown as Room[],

		id: 'booking1',

		guestId: 'guest1',
		checkIn: '2024-12-15T14:00',
		checkOut: '2024-12-20T11:00',
		totalPrice: 500,
		totalPriceWithDiscount: 450,
		discount: 50,
		discountType: 'SEASONAL',
		status: BookingStatus.CONFIRMED,
		isPaid: false,
		paidAmount: 100,
		bookedMoney: 50,

		transaction: {
			id: 'trans1',
			amount: 450,
			status: PaymentStatus.PENDING,
			bookingId: 'booking1',
			description: 'Room booking payment'
		} as Transaction
	};
	// booking = dummyData;
</script>

<div class="container mx-auto p-6">
	<h1 class="text-2xl font-bold mb-6">Edit Booking</h1>

	{#if loading}
		<div class="flex justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
			<p>{error}</p>
		</div>
	{:else if booking}
		<form on:submit={handleSubmit} class="space-y-6">
			<!-- Booking Details -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<h2 class="text-xl font-semibold">Booking Information</h2>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Check-in Date</Label>
						<input
							type="datetime-local"
							bind:value={booking.checkIn}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Check-out Date</Label>
						<input
							type="datetime-local"
							bind:value={booking.checkOut}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Status</Label>
						<select
							bind:value={booking.status}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							{#each bookingStatuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Room Selection -->
				<div class="space-y-4">
					<h2 class="text-xl font-semibold">Room Selection</h2>

					{#each booking.rooms as bookingRoom}
						<div class="border p-4 rounded-md">
							<Label class="block text-sm font-medium text-gray-700">Current Room</Label>
							<select
								bind:value={bookingRoom.roomId}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							>
								{#each availableRooms as room}
									<option value={room.id}>
										{room.roomNumber} - {room.type} (${room.pricePerNight}/night)
									</option>
								{/each}
							</select>

							<div class="mt-2">
								<Label class="block text-sm font-medium text-gray-700">Price per Night</Label>
								<input
									type="number"
									bind:value={bookingRoom.pricePerNight}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
								/>
							</div>

							<div class="mt-2">
								<Label class="block text-sm font-medium text-gray-700">Number of Guests</Label>
								<input
									type="number"
									bind:value={bookingRoom.numberOfGuests}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Payment Information -->
			<!-- <div class="mt-8 space-y-4">
				<h2 class="text-xl font-semibold">Payment Information</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Label class="block text-sm font-medium text-gray-700">Total Price</Label>
						<input
							type="number"
							bind:value={booking.totalPrice}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Discount</Label>
						<input
							type="number"
							bind:value={booking.discount}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Total Price with Discount</Label>
						<input
							type="number"
							bind:value={booking.totalPriceWithDiscount}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							readonly
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Payment Status</Label>
						<select
							bind:value={transaction.status}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							{#each paymentStatuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700">Paid Amount</Label>
						<input
							type="number"
							bind:value={booking.paidAmount}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</div>
				</div>
			</div> -->

			<!-- Action Buttons -->
			<div class="flex justify-end space-x-4 mt-8">
				<button
					type="button"
					class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
					on:click={() => window.history.back()}
				>
					Cancel
				</button>

				<button
					type="submit"
					class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
					disabled={loading}
				>
					{loading ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	{/if}
</div>

<!-- Add this to your routes folder as [bookingId]/+page.svelte -->
