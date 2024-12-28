<!-- routes/admin/bookings/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import BookingDetailsModal from '$lib/components/Booking/BookingDetailsModal.svelte';
	import type { Booking } from '$lib/types/Booking.js';
	import { format } from 'date-fns';
	import { CreditCard, Edit, Eye, Trash2 } from 'lucide-svelte';

	export let data;
	const bookings = data.bookings;
	let selectedBooking: Booking | null = null;
	let showDetailsModal = false;

	function handleViewDetails(booking: Booking) {
		selectedBooking = booking;
		showDetailsModal = true;
	}

	async function updateBookingStatus(bookingId: string, newStatus: string) {
		try {
			const response = await fetch(`/api/bookings/${bookingId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				// Refresh the page or update the local state
				window.location.reload();
			}
		} catch (error) {
			console.error('Error updating booking:', error);
		}
	}
	function formatDate(date: string) {
		return format(new Date(date), 'MMM dd, yyyy hh:mm a');
	}

	function calculateRemainingAmount(booking: Booking) {
		return booking.totalPrice - booking.paidAmount;
	}
</script>

<div class="p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold">Bookings</h1>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
							>Check In/Out</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
							>Total Price</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
							>Paid Amount</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
							>Transactions</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each bookings as booking}
						<tr>
							<td class="px-6 py-4">
								<div class="text-sm">
									{#each booking.rooms as room}
										<div class="mb-1">
											<span class="font-medium">Room {room.room.roomNumber}</span>
											<div class="text-gray-500">
												{room.numberOfGuests} guests
											</div>
										</div>
									{/each}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm">
									<div>In: {formatDate(booking.checkIn)}</div>
									<div>Out: {formatDate(booking.checkOut)}</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm font-medium">
									{booking.totalPrice} BDT
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm">
									<div class="font-medium">{booking.paidAmount} BDT</div>
									{#if !booking.isPaid}
										<div class="text-red-600">
											Remaining: {calculateRemainingAmount(booking)} BDT
										</div>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<!-- {#if booking.status === 'PENDING'}
									<Button
										color="green"
										on:click={() => updateBookingStatus(booking.id, 'CONFIRMED')}
									>
										Confirm
									</Button>
								{/if}
								{#if booking.status === 'CONFIRMED'}
									<Button color="red" on:click={() => updateBookingStatus(booking.id, 'CANCELLED')}>
										Cancel
									</Button>
								{/if} -->
								<span
									class="px-2 py-1 text-xs font-medium rounded-full
                                    {booking.status === 'CONFIRMED'
										? 'bg-green-100 text-green-800'
										: booking.status === 'PENDING'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'}"
								>
									{booking.status}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="flex gap-2">
									{#if booking.transaction.length > 0}
										<div class="flex flex-col gap-1">
											{#each booking.transaction as transaction}
												<div class="flex items-center gap-2 text-sm">
													<CreditCard class="w-4 h-4" />
													<span>{transaction.amount} BDT</span>
													<span
														class="px-1.5 py-0.5 text-xs rounded-full
                                                        {transaction.status === 'COMPLETED'
															? 'bg-green-100 text-green-800'
															: 'bg-yellow-100 text-yellow-800'}"
													>
														{transaction.status}
													</span>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</td>
							<td>
								<div class="flex gap-3 flex-wrap">
									<button
										class="text-blue-600 hover:text-blue-800"
										on:click={() => handleViewDetails(booking)}
									>
										<Eye class="w-5 h-5" />
									</button>
									<button
										class="text-green-600 hover:text-green-800"
										on:click={() => goto(`/admin/bookings/${booking.id}`)}
									>
										<Edit />
									</button>
									<button
										class="text-red-600 hover:text-red-800"
										on:click={() => handleViewDetails(booking)}
									>
										<Trash2 class="w-5 h-5" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
<!-- Add modal at the bottom of your template -->
{#if showDetailsModal && selectedBooking}
	<BookingDetailsModal
		booking={selectedBooking}
		onClose={() => {
			showDetailsModal = false;
			selectedBooking = null;
		}}
	/>
{/if}
