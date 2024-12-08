<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-svelte';
	import type { StripeError } from '@stripe/stripe-js';

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
	let error: StripeError | null = null;

	onMount(() => {
		const getCookie = (name: string): string | null => {
			const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
			return match ? decodeURIComponent(match[2]) : null;
		};

		const bookingInfoStr = getCookie('bookingInfo');
		if (bookingInfoStr) {
			bookingData = JSON.parse(bookingInfoStr);
		}

		// Get error from URL params if available
		const urlParams = new URLSearchParams(window.location.search);
		const errorMessage = urlParams.get('error');
		if (errorMessage) {
			error = {
				type: 'card_error',
				message: errorMessage,
				code: urlParams.get('code') || 'payment_failed'
			};
		}
	});

	const handleRetry = () => {
		goto('/payment'); // Redirect back to payment page
	};

	const handleContactSupport = () => {
		// Replace with your support email or contact page
		window.location.href = 'mailto:support@yourhotel.com';
	};
</script>

<div class="min-h-screen bg-gray-50 py-12 mt-[100px]">
	<div class="container mx-auto px-4 max-w-3xl">
		<!-- Error Message -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
				<XCircle class="w-8 h-8 text-red-600" />
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
			<p class="text-gray-600 mb-4">
				{error?.message || "We couldn't process your payment. Please try again."}
			</p>
		</div>

		<!-- Error Details -->
		{#if error}
			<div class="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
				<div class="flex items-start">
					<AlertTriangle class="w-5 h-5 text-red-600 mt-0.5" />
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error Details</h3>
						<p class="text-sm text-red-700 mt-1">
							{error.message}
							{#if error.code}
								<br />
								<span class="text-xs opacity-75">Error code: {error.code}</span>
							{/if}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Booking Details -->
		{#if bookingData}
			<div class="bg-gray-100 rounded-lg shadow-sm p-6 mb-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
				<div class="space-y-4">
					<div class="flex justify-between border-b border-gray-100 pb-4">
						<span class="text-gray-600">Amount to Pay</span>
						<span class="font-medium text-red-600">${bookingData.totalAmount.toFixed(2)}</span>
					</div>

					{#each bookingData.rooms as room}
						<div class="border-b border-gray-100 pb-4">
							<div class="flex justify-between mb-2">
								<span class="text-gray-600">Room</span>
								<span class="font-medium">{room.type} ({room.roomNumber})</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Guests</span>
								<span>{room.numberOfGuests}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- What to Do Next -->
			<div class="bg-gray-100 rounded-lg p-6 mb-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">What to Do Next</h3>
				<ul class="space-y-3 text-gray-600">
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-gray-600 rounded-full"></div>
						</div>
						<span class="ml-2">Check if your card has sufficient funds</span>
					</li>
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-gray-600 rounded-full"></div>
						</div>
						<span class="ml-2">Verify your card details and try again</span>
					</li>
					<li class="flex items-start">
						<div class="flex-shrink-0 w-5 h-5 mt-1">
							<div class="w-2 h-2 bg-gray-600 rounded-full"></div>
						</div>
						<span class="ml-2">Contact your bank if the issue persists</span>
					</li>
				</ul>
			</div>

			<!-- Action Buttons -->
			<div class="grid gap-4 md:grid-cols-2">
				<button
					on:click={handleRetry}
					class="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
				>
					<RefreshCw class="w-4 h-4 mr-2" />
					Try Again
				</button>

				<button
					on:click={() => goto('/')}
					class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-4 h-4 mr-2" />
					Back to Home
				</button>
			</div>

			<!-- Support Options -->
			<div class="mt-6 text-center">
				<p class="text-gray-600">Need help?</p>
				<button
					on:click={handleContactSupport}
					class="text-blue-600 hover:text-blue-700 font-medium mt-1"
				>
					Contact Support
				</button>
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading booking details...</p>
			</div>
		{/if}
	</div>
</div>
