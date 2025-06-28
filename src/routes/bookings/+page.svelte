<!-- src/lib/components/BookingsCards.svelte -->
<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import BookingActionCell from '$lib/components/Booking/BookingActionCell.svelte';
	import type {
		Booking,
		BookingsResponse,
		BookingStatus,
		TransactionStatus
	} from '$lib/types/Booking';
	import { format } from 'date-fns';
	import {
		Badge,
		Spinner,
		Card,
		Button,
		Modal,
		Label,
		Input,
		Textarea,
		Select,
		Tabs,
		TabItem
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		CalendarIcon,
		UsersIcon,
		CreditCardIcon,
		HomeIcon,
		AlertTriangleIcon,
		ClockIcon,
		UserIcon
	} from 'lucide-svelte';

	let bookings: Booking[] = [];
	let loading = true;
	let error: string | null = null;
	export let booking: Booking;

	// Issue reporting modal state
	let reportIssueModal = false;
	let selectedBookingId: string = '';
	let selectedRoomId: string = '';
	let submittingIssue = false;
	let issueSubmissionMessage = '';
	let issueSubmissionType: 'success' | 'error' | '' = '';
	let issueForm = {
		title: '',
		description: '',
		status: 'OPEN',
		priority: 'MEDIUM'
	};

	// Previous issues state
	let previousIssues: any[] = [];
	let loadingPreviousIssues = false;
	let previousIssuesError: string | null = null;

	// Issue enums (you should import these from your types file)
	const IssueStatus = {
		OPEN: 'OPEN',
		IN_PROGRESS: 'IN_PROGRESS',
		CLOSED: 'CLOSED'
	};

	const IssuePriority = {
		LOW: 'LOW',
		MEDIUM: 'MEDIUM',
		HIGH: 'HIGH'
	};

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

	const fetchPreviousIssues = async (roomId: string): Promise<void> => {
		loadingPreviousIssues = true;
		previousIssuesError = null;

		try {
			const response = await fetch(
				`${PUBLIC_API_URL}/issue/get-all-issues-by-user/${selectedRoomId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					credentials: 'include'
				}
			);

			const data = await response.json();

			if (response.ok) {
				previousIssues = data.data || [];
			} else {
				throw new Error(data.message || 'Failed to fetch previous issues');
			}
		} catch (err) {
			console.error('Error fetching previous issues:', err);
			previousIssuesError = err instanceof Error ? err.message : 'Failed to load previous issues';
			previousIssues = [];
		} finally {
			loadingPreviousIssues = false;
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

	const getIssueStatusColor = (status: string) => {
		switch (status) {
			case 'OPEN':
				return 'red';
			case 'IN_PROGRESS':
				return 'yellow';
			case 'CLOSED':
				return 'green';
			default:
				return 'indigo';
		}
	};

	const getIssuePriorityColor = (priority: string) => {
		switch (priority) {
			case 'HIGH':
				return 'red';
			case 'MEDIUM':
				return 'yellow';
			case 'LOW':
				return 'green';
			default:
				return 'indigo';
		}
	};

	const formatDate = (dateString: string): string => {
		return format(new Date(dateString), 'MMM dd, yyyy');
	};

	const formatDateShort = (dateString: string): string => {
		return format(new Date(dateString), 'MMM dd');
	};

	const formatDateTime = (dateString: string): string => {
		return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
	};

	const handleDelete = (bookingId: string) => {
		// Handle the deletion logic here
		console.log('Deleting booking:', bookingId);
	};

	const openReportIssueModal = async (bookingId: string, roomId: string) => {
		selectedBookingId = bookingId;
		selectedRoomId = roomId;
		issueForm = {
			title: '',
			description: '',
			status: 'OPEN',
			priority: 'MEDIUM'
		};
		issueSubmissionMessage = '';
		issueSubmissionType = '';
		reportIssueModal = true;
		console.log('Opening report issue modal for booking:', bookingId, 'and room:', roomId);
		// Fetch previous issues for this room
		await fetchPreviousIssues(roomId);
	};

	const submitIssueReport = async () => {
		submittingIssue = true;
		issueSubmissionMessage = '';
		issueSubmissionType = '';

		try {
			// Add your API call here to submit the issue
			const response = await fetch(`${PUBLIC_API_URL}/issue/create-issue`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				credentials: 'include',
				body: JSON.stringify({
					...issueForm,
					bookingId: selectedBookingId,
					roomId: selectedRoomId
				})
			});

			const data = await response.json();

			if (response.ok) {
				issueSubmissionMessage = 'Issue reported successfully! We will look into it shortly.';
				issueSubmissionType = 'success';

				// Refresh previous issues to show the new one
				await fetchPreviousIssues(selectedRoomId);

				// Close modal after 2 seconds
				setTimeout(() => {
					reportIssueModal = false;
					issueSubmissionMessage = '';
					issueSubmissionType = '';
				}, 2000);
			} else {
				throw new Error(data.message || 'Failed to report issue');
			}
		} catch (err) {
			console.error('Error reporting issue:', err);
			issueSubmissionMessage =
				err instanceof Error
					? err.message
					: 'An unexpected error occurred while reporting the issue';
			issueSubmissionType = 'error';
		} finally {
			submittingIssue = false;
		}
	};

	onMount(() => {
		fetchBookings();
	});
</script>

<div class="p-6 mt-[100px] max-w-7xl mx-auto">
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-gray-900 mb-2">My Bookings</h2>
		<p class="text-gray-600">Manage and track your hotel reservations</p>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<Spinner size="8" />
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
			<div class="flex items-center">
				<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				{error}
			</div>
		</div>
	{:else if bookings.length === 0}
		<div class="text-center py-12">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
			<p class="mt-1 text-sm text-gray-500">Get started by making your first reservation.</p>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each bookings as booking}
				{#each booking.rooms as room}
					<Card class="hover:shadow-lg transition-shadow duration-200">
						<div class="space-y-4">
							<!-- Header -->
							<div class="flex justify-between items-start">
								<div class="flex items-center space-x-2">
									<HomeIcon class="w-5 h-5 text-blue-600" />
									<h3 class="text-lg font-semibold text-gray-900">
										Room {room.room.roomNumber}
									</h3>
								</div>
								<div class="flex items-center space-x-2">
									<button
										on:click={() => openReportIssueModal(booking.id, room.roomId)}
										class="p-1 text-gray-400 hover:text-red-500 transition-colors"
										title="Report Issue"
									>
										<AlertTriangleIcon class="w-4 h-4" />
									</button>
									<Badge color={getStatusColor(booking.status)} class="text-xs">
										{booking.status}
									</Badge>
								</div>
							</div>

							<!-- Dates Section -->
							<div class="bg-gray-50 rounded-lg p-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<CalendarIcon class="w-4 h-4 text-gray-500" />
										<div>
											<p class="text-xs text-gray-500">Check In</p>
											<p class="font-medium text-sm">{formatDateShort(booking.checkIn)}</p>
										</div>
									</div>
									<div class="w-8 border-t border-gray-300"></div>
									<div class="flex items-center space-x-2">
										<div class="text-right">
											<p class="text-xs text-gray-500">Check Out</p>
											<p class="font-medium text-sm">{formatDateShort(booking.checkOut)}</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Guests and Pricing -->
							<div class="space-y-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<UsersIcon class="w-4 h-4 text-gray-500" />
										<span class="text-sm text-gray-600">
											{room.numberOfGuests}
											{room.numberOfGuests > 1 ? 'guests' : 'guest'}
										</span>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-3">
									<div>
										<p class="text-xs text-gray-500">Total Price</p>
										<p class="font-semibold text-lg text-gray-900">{booking.totalPrice} BDT</p>
									</div>
									<div>
										<p class="text-xs text-gray-500">Paid Amount</p>
										<p class="font-semibold text-lg text-green-600">{booking.paidAmount} BDT</p>
									</div>
								</div>
							</div>

							<!-- Payment Status -->
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-2">
									<CreditCardIcon class="w-4 h-4 text-gray-500" />
									<span class="text-sm text-gray-600">Payment Status</span>
								</div>
								{#if booking.transaction && booking.transaction.length > 0}
									<Badge
										color={getPaymentStatusColor(booking.transaction[0].status)}
										class="text-xs"
									>
										{booking.transaction[0].status}
									</Badge>
								{:else}
									<Badge color="yellow" class="text-xs">NO PAYMENT</Badge>
								{/if}
							</div>

							<!-- Action Buttons -->
							<div class="pt-2 border-t border-gray-100">
								<BookingActionCell {booking} onDelete={handleDelete} />
							</div>
						</div>
					</Card>
				{/each}
			{/each}
		</div>
	{/if}
</div>

<!-- Report Issue Modal with Tabs -->
<Modal bind:open={reportIssueModal} size="lg" autoclose={false} class="w-full">
	<div>
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Room Issues Management</h3>

		<Tabs style="underline" contentClass="mt-4">
			<TabItem open title="Report New Issue">
				<form on:submit|preventDefault={submitIssueReport} class="space-y-6">
					<!-- Success/Error Message -->
					{#if issueSubmissionMessage}
						<div
							class="p-4 rounded-lg {issueSubmissionType === 'success'
								? 'bg-green-50 border border-green-200'
								: 'bg-red-50 border border-red-200'}"
						>
							<div class="flex items-center">
								{#if issueSubmissionType === 'success'}
									<svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-green-700">{issueSubmissionMessage}</span>
								{:else}
									<svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-red-700">{issueSubmissionMessage}</span>
								{/if}
							</div>
						</div>
					{/if}

					<div>
						<Label for="title" class="mb-2">Issue Title</Label>
						<Input
							type="text"
							id="title"
							bind:value={issueForm.title}
							placeholder="Brief description of the issue"
							disabled={submittingIssue}
							required
						/>
					</div>

					<div>
						<Label for="description" class="mb-2">Description</Label>
						<Textarea
							id="description"
							bind:value={issueForm.description}
							placeholder="Provide detailed information about the issue..."
							rows="4"
							disabled={submittingIssue}
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label for="priority" class="mb-2">Priority</Label>
							<Select id="priority" bind:value={issueForm.priority} disabled={submittingIssue}>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
							</Select>
						</div>

						<!-- <div>
							<Label for="status" class="mb-2">Status</Label>
							<Select id="status" bind:value={issueForm.status} disabled={submittingIssue}>
								<option value="OPEN">Open</option>
								<option value="IN_PROGRESS">In Progress</option>
								<option value="CLOSED">Closed</option>
							</Select>
						</div> -->
					</div>

					<div class="flex justify-end space-x-3 pt-4 border-t">
						<Button
							type="button"
							color="alternative"
							disabled={submittingIssue}
							on:click={() => (reportIssueModal = false)}
						>
							Cancel
						</Button>
						<Button type="submit" color="red" disabled={submittingIssue}>
							{#if submittingIssue}
								<Spinner class="mr-2" size="4" />
								Reporting...
							{:else}
								<AlertTriangleIcon class="w-4 h-4 mr-2" />
								Report Issue
							{/if}
						</Button>
					</div>
				</form>
			</TabItem>

			<TabItem title="Previous Issues">
				<div class="space-y-4">
					{#if loadingPreviousIssues}
						<div class="flex justify-center items-center h-32">
							<Spinner size="6" />
							<span class="ml-2 text-gray-600">Loading previous issues...</span>
						</div>
					{:else if previousIssuesError}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
							<div class="flex items-center">
								<AlertTriangleIcon class="w-5 h-5 mr-2" />
								{previousIssuesError}
							</div>
						</div>
					{:else if previousIssues.length === 0}
						<div class="text-center py-8">
							<AlertTriangleIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
							<h4 class="text-lg font-medium text-gray-900 mb-2">No Previous Issues</h4>
							<p class="text-gray-600">This room has no reported issues yet.</p>
						</div>
					{:else}
						<div class="space-y-4 max-h-96 overflow-y-auto">
							{#each previousIssues as issue}
								<Card class="border-l-4 border-l-blue-500">
									<div class="space-y-3">
										<!-- Issue Header -->
										<div class="flex justify-between items-start">
											<div>
												<h4 class="font-semibold text-gray-900">{issue.title}</h4>
												<div class="flex items-center space-x-2 mt-1">
													<Badge color={getIssueStatusColor(issue.status)} class="text-xs">
														{issue.status}
													</Badge>
													<Badge color={getIssuePriorityColor(issue.priority)} class="text-xs">
														{issue.priority} Priority
													</Badge>
												</div>
											</div>
										</div>

										<!-- Issue Description -->
										{#if issue.description}
											<div>
												<p class="text-sm text-gray-700">{issue.description}</p>
											</div>
										{/if}

										<!-- Issue Meta Information -->
										<div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
											<div class="flex items-center space-x-2">
												<ClockIcon class="w-4 h-4" />
												<span>Created: {formatDateTime(issue.createdAt)}</span>
											</div>
											{#if issue.updatedAt !== issue.createdAt}
												<div class="flex items-center space-x-2">
													<ClockIcon class="w-4 h-4" />
													<span>Updated: {formatDateTime(issue.updatedAt)}</span>
												</div>
											{/if}
										</div>

										<!-- Reported By -->
										{#if issue.reportedBy}
											<div class="flex items-center space-x-2 text-sm text-gray-600">
												<UserIcon class="w-4 h-4" />
												<span>Reported by: {issue.reportedBy.name || issue.reportedBy.email}</span>
											</div>
										{/if}
									</div>
								</Card>
							{/each}
						</div>
					{/if}

					<div class="flex justify-end pt-4 border-t">
						<Button type="button" color="alternative" on:click={() => (reportIssueModal = false)}>
							Close
						</Button>
					</div>
				</div>
			</TabItem>
		</Tabs>
	</div>
</Modal>
