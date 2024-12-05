<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		loadStripe,
		type Stripe,
		type StripeError,
		type StripeElements
	} from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Elements, LinkAuthenticationElement, PaymentElement, Address } from 'svelte-stripe';

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
	let clientSecret: string | null = 'pi_3QSbVYDbQAAtiyHm22jq3wq3_secret_JjX1AfkmyDE8vHOF0evHWRMeL';
	let error: StripeError | null = null;
	let elements: StripeElements | undefined;
	let processing = false;

	onMount(async () => {
		try {
			stripe = await loadStripe(PUBLIC_STRIPE_KEY);
			if (!stripe) {
				throw new Error('Failed to load Stripe');
			}

			// create payment intent server side
			clientSecret = 'pi_3QSbVYDbQAAtiyHm22jq3wq3_secret_JjX1AfkmyDE8vHOF0evHWRMeL';
			console.log(clientSecret);
			// await createPaymentIntent();
		} catch (err) {
			error = {
				type: 'api_error',
				message: err instanceof Error ? err.message : 'Failed to initialize payment',
				code: 'initialization_failed'
			};
		}
	});

	async function createPaymentIntent(): Promise<string> {
		try {
			const response = await fetch('/examples/payment-element/payment-intent', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({})
			});

			if (!response.ok) {
				throw new Error('Failed to create payment intent');
			}

			const { clientSecret }: PaymentIntentResponse = await response.json();
			return clientSecret;
		} catch (err) {
			throw new Error(err instanceof Error ? err.message : 'Failed to create payment intent');
		}
	}

	async function submit(): Promise<void> {
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
				// payment succeeded, redirect to "thank you" page
				await goto('/examples/payment-element/thanks');
			}
		} catch (err) {
			error = {
				type: 'api_error',
				message: err instanceof Error ? err.message : 'Payment failed',
				code: 'payment_failed'
			};
			processing = false;
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

<div class="min-h-screen bg-gray-50 py-12">
	<div class="container mx-auto px-4 max-w-3xl">
		<!-- Header Section -->
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
			<p class="text-gray-600">Secure payment processing by Stripe</p>
		</div>

		<!-- Order Summary -->
		<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
			<div class="flex justify-between items-center pb-4 border-b border-gray-200">
				<div>
					<p class="font-medium">Room Booking</p>
					<p class="text-sm text-gray-600">2 nights • Dec 15 - Dec 17</p>
				</div>
				<p class="font-semibold">$299.00</p>
			</div>
			<div class="flex justify-between items-center py-4">
				<p class="font-medium">Total Amount</p>
				<p class="text-xl font-bold text-blue-600">$299.00</p>
			</div>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-600 text-sm">{error.message} Please try again.</p>
			</div>
		{/if}

		{#if clientSecret}
			<div class="bg-white rounded-lg shadow-sm p-6">
				<Elements
					{stripe}
					{clientSecret}
					theme="flat"
					labels="floating"
					variables={{
						colorPrimary: '#2563eb',
						colorBackground: '#ffffdd',
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
