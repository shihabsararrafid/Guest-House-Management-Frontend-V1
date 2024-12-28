<!-- components/BookingDetailsModal.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import { CreditCard, X } from 'lucide-svelte';

	export let booking;
	export let onClose;
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
	<div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold">Booking Details</h2>
			<button on:click={onClose} class="text-gray-500 hover:text-gray-700">
				<X class="w-6 h-6" />
			</button>
		</div>

		<!-- Booking Info -->
		<div class="grid grid-cols-2 gap-6 mb-6">
			<div>
				<h3 class="font-medium mb-2">Booking Information</h3>
				<div class="space-y-2 text-sm">
					<p><span class="font-medium">Booking ID:</span> {booking.id}</p>
					<p>
						<span class="font-medium">Status:</span>
						<span
							class="px-2 py-1 text-xs rounded-full
                            {booking.status === 'CONFIRMED'
								? 'bg-green-100 text-green-800'
								: booking.status === 'PENDING'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-red-100 text-red-800'}"
						>
							{booking.status}
						</span>
					</p>
					<p>
						<span class="font-medium">Check In:</span>
						{format(new Date(booking.checkIn), 'PPP p')}
					</p>
					<p>
						<span class="font-medium">Check Out:</span>
						{format(new Date(booking.checkOut), 'PPP p')}
					</p>
				</div>
			</div>

			<div>
				<h3 class="font-medium mb-2">Payment Information</h3>
				<div class="space-y-2 text-sm">
					<p><span class="font-medium">Total Price:</span> {booking.totalPrice} BDT</p>
					<p><span class="font-medium">Paid Amount:</span> {booking.paidAmount} BDT</p>
					<p>
						<span class="font-medium">Remaining:</span>
						{booking.totalPrice - booking.paidAmount} BDT
					</p>
					<p>
						<span class="font-medium">Payment Status:</span>
						{booking.isPaid ? 'Paid' : 'Pending'}
					</p>
				</div>
			</div>
		</div>

		<!-- Rooms -->
		<div class="mb-6">
			<h3 class="font-medium mb-2">Booked Rooms</h3>
			<div class="grid gap-4">
				{#each booking.rooms as room}
					<div class="border rounded p-4">
						<p class="font-medium">Room {room.room.roomNumber}</p>
						<p class="text-sm text-gray-600">Guests: {room.numberOfGuests}</p>
						<p class="text-sm text-gray-600">Price per night: {room.pricePerNight} BDT</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Transactions -->
		<div>
			<h3 class="font-medium mb-2">Transactions</h3>
			<div class="space-y-4">
				{#each booking.transaction as transaction}
					<div class="border rounded p-4">
						<div class="flex items-center justify-between mb-2">
							<div class="flex items-center gap-2">
								<CreditCard class="w-4 h-4" />
								<span class="font-medium">{transaction.amount} BDT</span>
							</div>
							<span
								class="px-2 py-1 text-xs rounded-full
                                {transaction.status === 'COMPLETED'
									? 'bg-green-100 text-green-800'
									: 'bg-yellow-100 text-yellow-800'}"
							>
								{transaction.status}
							</span>
						</div>
						<div class="text-sm text-gray-600">
							<p>Transaction ID: {transaction.id}</p>
							<p>Created: {format(new Date(transaction.createdAt), 'PPP p')}</p>
							{#if transaction.stripeReceiptUrl}
								<a
									href={transaction.stripeReceiptUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 hover:underline"
								>
									View Receipt
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
