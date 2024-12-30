<!-- BookingActionsCell.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { downloadHTMLReceipt } from '$lib/functions/downloadReceipt';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { Trash2 } from 'lucide-svelte';

	export let booking;
	export let onDelete = (id: string) => {};

	let showDialog = false;
	let showPaymentDialog = false;
	let payableAmount = 0;
	let isProcessing = false;
	let error = '';

	const handleDelete = () => {
		onDelete(booking.id);
		showDialog = false;
	};
	console.log(booking, 'booking');
	const handlePayment = async () => {
		try {
			isProcessing = true;

			// Store booking info in cookie
			const d = {
				amount: typeof payableAmount === 'string' ? parseInt(payableAmount) : payableAmount,
				currency: 'bdt'
			};
			console.log(d);
			if (browser) {
				const bookingInfo = {
					bookingId: booking.id,
					totalAmount: booking.totalPrice,
					rooms: booking.rooms.map((room: any) => ({
						roomNumber: room.room.roomNumber,
						type: room.room.type,
						numberOfGuests: room.numberOfGuests,
						pricePerNight: room.pricePerNight
					})),
					checkIn: booking.checkIn,
					checkOut: booking.checkOut
					// payment: d
				};

				document.cookie = `bookingInfo=${JSON.stringify(bookingInfo)}; path=/; max-age=3600; Secure; SameSite=Strict`;
			}

			const response1 = await fetch(`${PUBLIC_API_URL}/payment/make-payment/${booking.id}`, {
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
					`/checkout?booking=${booking.id}&client-secret=${result1.data.client_secret}&paymentId=${result1.data.id}`
				);
			else throw new Error('Booking Successful  but payment unsuccessful . Contact with support');

			// Redirect to checkout
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process booking';
		} finally {
			isProcessing = false;
		}
	};
</script>

<div class="flex gap-2">
	<div>
		{#if booking.transaction && booking.transaction[0]}
			<a
				href={booking.transaction[0].stripeReceiptUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:underline"
			>
				Receipt
			</a>
		{/if}

		{#if !booking.isPaid}
			<Button on:click={() => (showPaymentDialog = true)}>Pay Now</Button>
		{/if}
		<Button on:click={() => downloadHTMLReceipt(booking)}>Download Receipt</Button>
	</div>

	<!-- Delete Button
	<button
		on:click={() => (showDialog = true)}
		class="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center"
	>
		<Trash2 class="h-4 w-4" />
	</button> -->
</div>

<!-- Delete Confirmation Dialog -->
{#if showDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h2 class="text-lg font-semibold mb-2">Delete Booking</h2>
			<div class="mb-4">
				<p>Are you sure you want to delete this booking?</p>

				{#if booking.transaction && booking.transaction[0]}
					<div class="mt-2">
						<p class="font-medium">Payment Details:</p>
						<p>Amount: {booking.transaction[0].amount} BDT</p>
						<p>Status: {booking.transaction[0].status}</p>
					</div>
				{/if}
			</div>

			<div class="flex justify-end gap-2">
				<button
					on:click={() => (showDialog = false)}
					class="px-4 py-2 border rounded-md hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					on:click={handleDelete}
					class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
<!-- Delete Confirmation Dialog -->
{#if showPaymentDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h2 class="text-lg font-semibold mb-2">Payment</h2>
			<div class="mb-4">
				<Label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Amount</Label
				>
				<Input
					bind:value={payableAmount}
					type="number"
					id="amount"
					name="amount"
					placeholder="1000"
					required
				/>
			</div>

			<div class="flex justify-end gap-2">
				<button
					on:click={() => (showPaymentDialog = false)}
					class="px-4 py-2 border rounded-md hover:bg-red-50"
				>
					Cancel
				</button>
				<Button
					isLo
					on:click={handlePayment}
					class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
				>
					{#if isProcessing}
						<div class="flex items-center justify-center">
							<div
								class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
							></div>
							Processing...
						</div>
					{:else}
						Proceed to Payment
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}
