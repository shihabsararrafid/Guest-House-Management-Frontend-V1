<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { CheckCircle } from 'lucide-svelte';

	interface BookingInfo {
		bookingId: string;
		totalAmount: number;
		rooms: Array<{
			roomNumber: string;
			type: string;
			numberOfGuests: number;
			pricePerNight: number;
		}>;
		checkIn: string;
		checkOut: string;
	}

	let bookingData: BookingInfo | null = null;

	onMount(() => {
		const getCookie = (name: string): string | null => {
			const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
			return match ? decodeURIComponent(match[2]) : null;
		};

		const bookingInfoStr = getCookie('bookingInfo');
		if (bookingInfoStr) {
			bookingData = JSON.parse(bookingInfoStr);
		}
	});

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<div class="min-h-screen bg-gray-50 py-12 mt-[100px]">
	<div class="container mx-auto px-4 max-w-3xl">
		<!-- Success Message -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
				<CheckCircle class="w-8 h-8 text-green-600" />
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
			<p class="text-gray-600">Your booking has been confirmed.</p>
		</div>

		<!-- Booking Details -->
		{#if bookingData}
			<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
				<div class="space-y-4">
					<div class="flex justify-between border-b border-gray-100 pb-4">
						<span class="text-gray-600">Booking ID</span>
						<span class="font-medium">{bookingData.bookingId}</span>
					</div>

					{#each bookingData.rooms as room}
						<div class="border-b border-gray-100 pb-4">
							<div class="flex justify-between mb-2">
								<span class="text-gray-600">Room Type</span>
								<span class="font-medium">{room.type} Room ({room.roomNumber})</span>
							</div>
							<div class="flex justify-between mb-2">
								<span class="text-gray-600">Guests</span>
								<span>{room.numberOfGuests} {room.numberOfGuests > 1 ? 'guests' : 'guest'}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Price per night</span>
								<span>${room.pricePerNight.toFixed(2)}</span>
							</div>
						</div>
					{/each}

					<div class="flex justify-between mb-2">
						<span class="text-gray-600">Check-in</span>
						<span class="font-medium">{formatDate(bookingData.checkIn)}</span>
					</div>

					<div class="flex justify-between mb-2">
						<span class="text-gray-600">Check-out</span>
						<span class="font-medium">{formatDate(bookingData.checkOut)}</span>
					</div>

					<div class="flex justify-between pt-4 border-t border-gray-200">
						<span class="text-lg font-semibold">Total Amount</span>
						<span class="text-lg font-bold text-blue-600"
							>${bookingData.totalAmount.toFixed(2)}</span
						>
					</div>
				</div>
			</div>

			<!-- Next Steps -->
			<div class="bg-blue-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
				<ul class="space-y-3 text-gray-600">
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
						</div>
						<span class="ml-2"
							>A confirmation email has been sent to your registered email address.</span
						>
					</li>
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
						</div>
						<span class="ml-2"
							>Please present your booking ID at check-in: <strong>{bookingData.bookingId}</strong
							></span
						>
					</li>
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
						</div>
						<span class="ml-2"
							>Check-in time starts at 2:00 PM on {formatDate(bookingData.checkIn)}</span
						>
					</li>
				</ul>
			</div>

			<!-- Action Buttons -->
			<div class="mt-8 space-y-4">
				<button
					on:click={() => goto('/dashboard')}
					class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
				>
					Go to Dashboard
				</button>
				<button
					on:click={() => window.print()}
					class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
				>
					Download Receipt
				</button>
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading booking details...</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@media print {
		button {
			display: none;
		}
	}
</style>
