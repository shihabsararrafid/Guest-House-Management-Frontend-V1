<!-- BookingActionsCell.svelte -->
<script lang="ts">
	import { Trash2 } from 'lucide-svelte';

	export let booking;
	export let onDelete = (id: string) => {};

	let showDialog = false;

	const handleDelete = () => {
		onDelete(booking.id);
		showDialog = false;
	};
</script>

<div class="flex gap-2">
	<div>
		{#if booking.transaction && booking.transaction[0]?.stripeReceiptUrl}
			<a
				href={booking.transaction[0].stripeReceiptUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:underline"
			>
				Receipt
			</a>
		{/if}

		{#if booking.status === 'PENDING' && (!booking.transaction?.[0] || booking.transaction[0].status !== 'COMPLETED')}
			<a href={`/payment/${booking.id}`} class="text-green-600 hover:underline"> Pay Now </a>
		{/if}
	</div>

	<!-- Delete Button -->
	<button
		on:click={() => (showDialog = true)}
		class="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center"
	>
		<Trash2 class="h-4 w-4" />
	</button>
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
