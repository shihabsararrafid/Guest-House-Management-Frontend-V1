<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		loadStripe,
		type Stripe,
		type StripeError,
		type StripeElements
	} from '@stripe/stripe-js';
	import { PUBLIC_API_URL, PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Elements, LinkAuthenticationElement, PaymentElement, Address } from 'svelte-stripe';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	interface PaymentIntentResponse {
		clientSecret: string;
	}

	interface PaymentResult {
		error?: StripeError;
		paymentIntent?: {
			status: string;
			id: string;
		};
	}

	let stripe: Stripe | null = null;
	let clientSecret: string | null = null;
	let error: StripeError | null = null;
	let elements: StripeElements | undefined;
	let processing = false;
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
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	};

	const calculateNights = (checkIn: string, checkOut: string): number => {
		const start = new Date(checkIn);
		const end = new Date(checkOut);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	};
	onMount(async () => {
		try {
			stripe = await loadStripe(PUBLIC_STRIPE_KEY);
			if (!stripe) {
				throw new Error('Failed to load Stripe');
			}
			const searchParams = $page.url.searchParams;
			// create payment intent server side
			clientSecret = searchParams.get('client-secret');
			console.log(clientSecret, 'dsds');

			if (browser) {
				const getCookie = (name: string): string | null => {
					const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
					return match ? decodeURIComponent(match[2]) : null;
				};

				const bookingInfoStr = getCookie('bookingInfo');
				if (bookingInfoStr) {
					bookingData = JSON.parse(bookingInfoStr);
				}
			}
			// console.log(clientSecret);
			// await createPaymentIntent();
		} catch (err) {
			error = {
				type: 'api_error',
				message: err instanceof Error ? err.message : 'Failed to initialize payment',
				code: 'initialization_failed'
			};
		}
	});

	async function submit(): Promise<void> {
		const searchParams = $page.url.searchParams;
		// avoid processing duplicates
		if (processing || !stripe || !elements) return;

		processing = true;

		try {
			const result: PaymentResult | undefined = await stripe.confirmPayment({
				elements,
				redirect: 'if_required'
			});

			// log results, for debugging
			console.log({ result });

			if (result?.error) {
				// payment failed, notify user
				error = result.error;
				processing = false;
			} else {
				const paymentId = searchParams.get('paymentId');
				const response = await fetch(`${PUBLIC_API_URL}/payment/confirm-payment/${paymentId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					body: JSON.stringify({ status: 'COMPLETED' }),
					credentials: 'include'
				});
				if (response.ok)
					// payment succeeded, redirect to "thank you" page
					await goto('/checkout/thank-you');
				else await goto('/checkout/failed-transaction');
			}
		} catch (err) {
			error = {
				type: 'api_error',
				message: err instanceof Error ? err.message : 'Payment failed',
				code: 'payment_failed'
			};
			processing = false;
			await goto('/checkout/failed-transaction');
		}
	}
</script>

<h1>Payment Element Example</h1>

<nav>
	<a href="https://github.com/joshnuss/svelte-stripe/tree/main/src/routes/examples/payment-element">
		View code
	</a>
</nav>

{#if error}
	<p class="error">{error.message} Please try again.</p>
{/if}

<div class="min-h-screen bg-gray-50 py-12 mt-[100px]">
	<div class="container mx-auto px-4 max-w-3xl">
		<!-- Header Section -->
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
			<p class="text-gray-600">Secure payment processing by Stripe</p>
		</div>

		<!-- Order Summary -->
		{#if bookingData}
			<div class="bg-slate-100 rounded-lg shadow-sm p-6 mb-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
				{#each bookingData?.rooms as room}
					<div class="flex justify-between items-center pb-4 border-b border-gray-200">
						<div>
							<p class="font-medium">{room.type} Room ({room.roomNumber})</p>
							<p class="text-sm text-gray-600">
								{calculateNights(bookingData.checkIn, bookingData.checkOut)} nights •
								{formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}
							</p>
							<p class="text-sm text-gray-600">{room.numberOfGuests} guests</p>
						</div>
						<p class="font-semibold">${room.pricePerNight.toFixed(2)}/night</p>
					</div>
				{/each}
				<div class="flex justify-between items-center py-4">
					<p class="font-medium">Total Amount</p>
					<p class="text-xl font-bold text-blue-600">${bookingData.totalAmount.toFixed(2)}</p>
				</div>
			</div>
		{:else}
			<div class="bg-slate-100 rounded-lg shadow-sm p-6 mb-6">
				<p class="text-center text-gray-600">Loading booking information...</p>
			</div>
		{/if}

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-600 text-sm">{error.message} Please try again.</p>
			</div>
		{/if}

		{#if clientSecret}
			<div class="bg-slate-100 rounded-lg shadow-sm p-6">
				<Elements
					{stripe}
					{clientSecret}
					theme="flat"
					labels="floating"
					variables={{
						colorPrimary: '#2563eb',
						colorBackground: '#ffffff',
						colorText: '#1f2937',
						colorDanger: '#dc2626',
						spacingUnit: '4px',
						borderRadius: '6px'
					}}
					rules={{
						'.Input': {
							border: 'solid 1px #e5e7eb',
							boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
						},
						'.Input:focus': {
							border: 'solid 1px #3b82f6',
							boxShadow: '0 0 0 1px #3b82f6'
						},
						'.Label': {
							fontWeight: '500'
						}
					}}
					bind:elements
				>
					<form on:submit|preventDefault={submit} class="space-y-6">
						<div class="space-y-4">
							<LinkAuthenticationElement />
							<PaymentElement />
							<Address mode="billing" />
						</div>

						<button
							type="submit"
							disabled={processing}
							class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{#if processing}
								<span class="flex items-center justify-center">
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										/>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Processing...
								</span>
							{:else}
								Pay $299.00
							{/if}
						</button>

						<p class="text-center text-sm text-gray-500 mt-4">
							<span class="flex items-center justify-center">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								Payments are secured and encrypted
							</span>
						</p>
					</form>
				</Elements>
			</div>
		{:else}
			<div class="flex justify-center items-center py-12">
				<!-- <div>Loading</div> -->
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{/if}
	</div>
</div>

<style>
	.error {
		color: tomato;
		margin: 2rem 0 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 2rem 0;
	}

	.payment-button {
		padding: 1rem;
		border-radius: 5px;
		border: solid 1px #ccc;
		color: white;
		background: var(--link-color);
		font-size: 1.2rem;
		margin: 1rem 0;
		cursor: pointer;
	}

	.payment-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
