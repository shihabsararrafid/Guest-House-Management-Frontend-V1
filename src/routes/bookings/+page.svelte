<!-- src/lib/components/BookingsTable.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge,
		Spinner
	} from 'flowbite-svelte';
	import { format } from 'date-fns';
	import type {
		Booking,
		BookingsResponse,
		BookingStatus,
		TransactionStatus
	} from '$lib/types/Booking';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { Delete, Trash2 } from 'lucide-svelte';
	import BookingActionCell from '$lib/components/Booking/BookingActionCell.svelte';
	let bookings: Booking[] = [];
	let loading = true;
	let error: string | null = null;
	export let booking: Booking;
	const fetchBookings = async (): Promise<void> => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/booking/get-bookings`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				credentials: 'include'
			});
			const data: BookingsResponse = await response.json();
			if (data.message === 'Success') {
				bookings = data.data;
			} else {
				throw new Error('Failed to fetch bookings');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	};

	const getStatusColor = (
		status: BookingStatus
	):
		| 'none'
		| 'red'
		| 'yellow'
		| 'green'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'blue'
		| 'dark'
		| 'primary'
		| undefined => {
		switch (status) {
			case 'CONFIRMED':
				return 'green';
			case 'PENDING':
				return 'yellow';
			case 'CANCELLED':
				return 'red';
			default:
				return 'indigo';
		}
	};

	const getPaymentStatusColor = (
		status: TransactionStatus
	):
		| 'none'
		| 'red'
		| 'yellow'
		| 'green'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'blue'
		| 'dark'
		| 'primary'
		| undefined => {
		switch (status) {
			case 'COMPLETED':
				return 'green';
			case 'PENDING':
				return 'yellow';
			case 'FAILED':
				return 'red';
			default:
				return 'primary';
		}
	};

	const formatDate = (dateString: string): string => {
		return format(new Date(dateString), 'MMM dd, yyyy');
	};

	const handleDelete = (bookingId: string) => {
		// Handle the deletion logic here
		console.log('Deleting booking:', bookingId);
	};
	onMount(() => {
		fetchBookings();
	});
</script>

<div class="p-10 mt-[100px]">
	<h2 class="text-2xl font-bold mb-4">My Bookings</h2>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<Spinner size="8" />
		</div>
	{:else if error}
		<div class="text-red-500 p-4 rounded-lg bg-red-50">
			{error}
		</div>
	{:else if bookings.length === 0}
		<div class="text-gray-500 p-4 text-center">No bookings found</div>
	{:else}
		<div class="overflow-x-auto">
			<Table striped={true}>
				<TableHead>
					<TableHeadCell>Room</TableHeadCell>
					<TableHeadCell>Check In</TableHeadCell>
					<TableHeadCell>Check Out</TableHeadCell>
					<TableHeadCell>Guests</TableHeadCell>
					<TableHeadCell>Total Price</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Payment</TableHeadCell>
					<TableHeadCell>Actions</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each bookings as booking}
						{#each booking.rooms as room}
							<TableBodyRow>
								<TableBodyCell>
									Room {room.room.roomNumber}
								</TableBodyCell>
								<TableBodyCell>
									{formatDate(booking.checkIn)}
								</TableBodyCell>
								<TableBodyCell>
									{formatDate(booking.checkOut)}
								</TableBodyCell>
								<TableBodyCell>
									{room.numberOfGuests}
									{room.numberOfGuests > 1 ? 'guests' : 'guest'}
								</TableBodyCell>
								<TableBodyCell>
									{booking.totalPrice} BDT
									<!-- {formatPrice(booking.totalPrice)} -->
								</TableBodyCell>
								<TableBodyCell>
									<!-- @ts-ignore -->
									<Badge color={getStatusColor(booking.status)}>
										{booking.status}
									</Badge>
								</TableBodyCell>
								<TableBodyCell>
									{#if booking.transaction && booking.transaction.length > 0}
										<!-- @ts-ignore -->
										<Badge color={getPaymentStatusColor(booking.transaction[0].status)}>
											{booking.transaction[0].status}
										</Badge>
									{:else}
										<Badge color="yellow">NO PAYMENT</Badge>
									{/if}
								</TableBodyCell>
								<TableBodyCell>
									<BookingActionCell {booking} onDelete={handleDelete} />
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
</div>
