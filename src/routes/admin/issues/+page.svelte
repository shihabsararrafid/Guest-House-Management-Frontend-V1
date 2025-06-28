<!-- src/routes/admin/issues/+page.svelte -->
<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
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
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Search,
		Dropdown,
		DropdownItem,
		Avatar,
		Tabs,
		TabItem
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		AlertTriangleIcon,
		ClockIcon,
		UserIcon,
		HomeIcon,
		FilterIcon,
		CheckCircleIcon,
		XCircleIcon,
		PlayCircleIcon,
		EyeIcon,
		EditIcon,
		CalendarIcon,
		SearchIcon,
		RefreshCwIcon
	} from 'lucide-svelte';

	// State for issues
	let issues: any[] = [];
	let filteredIssues: any[] = [];
	let loading = true;
	let error: string | null = null;

	// Filter and search state
	let searchTerm = '';
	let statusFilter = 'ALL';
	let priorityFilter = 'ALL';
	let roomFilter = '';

	// Modal states
	let viewIssueModal = false;
	let editIssueModal = false;
	let selectedIssue: any = null;
	let updatingIssue = false;
	let updateMessage = '';
	let updateMessageType: 'success' | 'error' | '' = '';

	// Edit form state
	let editForm = {
		title: '',
		description: '',
		status: '',
		priority: ''
	};

	// Statistics
	let stats = {
		total: 0,
		open: 0,
		inProgress: 0,
		closed: 0,
		high: 0,
		medium: 0,
		low: 0
	};

	// Issue enums
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

	const fetchIssues = async (): Promise<void> => {
		loading = true;
		error = null;

		try {
			const response = await fetch(`${PUBLIC_API_URL}/issue/get-all-issues`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				credentials: 'include'
			});

			const data = await response.json();

			if (response.ok) {
				issues = data.data || [];
				filterIssues();
				calculateStats();
			} else {
				throw new Error(data.message || 'Failed to fetch issues');
			}
		} catch (err) {
			console.error('Error fetching issues:', err);
			error = err instanceof Error ? err.message : 'Failed to load issues';
			issues = [];
		} finally {
			loading = false;
		}
	};

	const filterIssues = () => {
		filteredIssues = issues.filter((issue) => {
			const matchesSearch =
				searchTerm === '' ||
				issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				issue.room?.roomNumber?.toString().includes(searchTerm);

			const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
			const matchesPriority = priorityFilter === 'ALL' || issue.priority === priorityFilter;
			const matchesRoom =
				roomFilter === '' || issue.room?.roomNumber?.toString().includes(roomFilter);

			return matchesSearch && matchesStatus && matchesPriority && matchesRoom;
		});
	};

	const calculateStats = () => {
		stats.total = issues.length;
		stats.open = issues.filter((i) => i.status === 'OPEN').length;
		stats.inProgress = issues.filter((i) => i.status === 'IN_PROGRESS').length;
		stats.closed = issues.filter((i) => i.status === 'CLOSED').length;
		stats.high = issues.filter((i) => i.priority === 'HIGH').length;
		stats.medium = issues.filter((i) => i.priority === 'MEDIUM').length;
		stats.low = issues.filter((i) => i.priority === 'LOW').length;
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

	const formatDateTime = (dateString: string): string => {
		return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'OPEN':
				return AlertTriangleIcon;
			case 'IN_PROGRESS':
				return PlayCircleIcon;
			case 'CLOSED':
				return CheckCircleIcon;
			default:
				return AlertTriangleIcon;
		}
	};

	const openViewModal = (issue: any) => {
		selectedIssue = issue;
		viewIssueModal = true;
	};

	const openEditModal = (issue: any) => {
		selectedIssue = issue;
		editForm = {
			title: issue.title,
			description: issue.description || '',
			status: issue.status,
			priority: issue.priority
		};
		updateMessage = '';
		updateMessageType = '';
		editIssueModal = true;
	};

	const updateIssue = async () => {
		updatingIssue = true;
		updateMessage = '';
		updateMessageType = '';

		try {
			const response = await fetch(`${PUBLIC_API_URL}/issue/${selectedIssue.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				credentials: 'include',
				body: JSON.stringify(editForm)
			});

			const data = await response.json();

			if (response.ok) {
				updateMessage = 'Issue updated successfully!';
				updateMessageType = 'success';

				// Refresh issues list
				await fetchIssues();

				// Close modal after 1.5 seconds
				setTimeout(() => {
					editIssueModal = false;
					updateMessage = '';
					updateMessageType = '';
				}, 1500);
			} else {
				throw new Error(data.message || 'Failed to update issue');
			}
		} catch (err) {
			console.error('Error updating issue:', err);
			updateMessage = err instanceof Error ? err.message : 'Failed to update issue';
			updateMessageType = 'error';
		} finally {
			updatingIssue = false;
		}
	};

	const quickUpdateStatus = async (issueId: string, newStatus: string) => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/issue/${issueId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				credentials: 'include',
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				// Refresh issues list
				await fetchIssues();
			} else {
				const data = await response.json();
				throw new Error(data.message || 'Failed to update status');
			}
		} catch (err) {
			console.error('Error updating status:', err);
			// You might want to show a toast notification here
		}
	};

	// Reactive statements for filtering
	$: {
		if (
			searchTerm !== undefined ||
			statusFilter !== undefined ||
			priorityFilter !== undefined ||
			roomFilter !== undefined
		) {
			filterIssues();
		}
	}

	onMount(() => {
		fetchIssues();
	});
</script>

<div class="p-6 mt-[100px] max-w-full mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Issues Management</h1>
				<p class="text-gray-600">Monitor and resolve reported issues</p>
			</div>
			<Button on:click={fetchIssues} color="blue" class="flex items-center">
				<RefreshCwIcon class="w-4 h-4 mr-2" />
				Refresh
			</Button>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-gray-900">{stats.total}</h3>
			<p class="text-sm text-gray-600">Total Issues</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-red-600">{stats.open}</h3>
			<p class="text-sm text-gray-600">Open</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-yellow-600">{stats.inProgress}</h3>
			<p class="text-sm text-gray-600">In Progress</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-green-600">{stats.closed}</h3>
			<p class="text-sm text-gray-600">Closed</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-red-600">{stats.high}</h3>
			<p class="text-sm text-gray-600">High Priority</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-yellow-600">{stats.medium}</h3>
			<p class="text-sm text-gray-600">Medium Priority</p>
		</Card>
		<Card class="text-center">
			<h3 class="text-2xl font-bold text-green-600">{stats.low}</h3>
			<p class="text-sm text-gray-600">Low Priority</p>
		</Card>
	</div>
	<div>
		<div class="mb-6 w-full shadow-lg rounded-lg bg-white p-4">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<div>
					<Label for="search" class="mb-2">Search Issues</Label>
					<Search
						id="search"
						bind:value={searchTerm}
						placeholder="Search by title, description, or room..."
						class="w-full"
					/>
				</div>
				<div>
					<Label for="status-filter" class="mb-2">Status</Label>
					<Select id="status-filter" bind:value={statusFilter}>
						<option value="ALL">All Status</option>
						<option value="OPEN">Open</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="CLOSED">Closed</option>
					</Select>
				</div>
				<div>
					<Label for="priority-filter" class="mb-2">Priority</Label>
					<Select id="priority-filter" bind:value={priorityFilter}>
						<option value="ALL">All Priorities</option>
						<option value="HIGH">High</option>
						<option value="MEDIUM">Medium</option>
						<option value="LOW">Low</option>
					</Select>
				</div>
				<div>
					<Label for="room-filter" class="mb-2">Room Number</Label>
					<Input id="room-filter" bind:value={roomFilter} placeholder="Filter by room..." />
				</div>
				<div class="flex items-end">
					<Button
						color="alternative"
						class="w-full"
						on:click={() => {
							searchTerm = '';
							statusFilter = 'ALL';
							priorityFilter = 'ALL';
							roomFilter = '';
						}}
					>
						Clear Filters
					</Button>
				</div>
			</div>
		</div>
	</div>
	<!-- Filters and Search -->

	<!-- Issues Content -->
	{#if loading}
		<div class="flex justify-center items-center h-64">
			<Spinner size="8" />
			<span class="ml-3 text-gray-600">Loading issues...</span>
		</div>
	{:else if error}
		<Card class="border-red-200 bg-red-50">
			<div class="flex items-center text-red-700">
				<AlertTriangleIcon class="w-5 h-5 mr-2" />
				{error}
			</div>
		</Card>
	{:else if filteredIssues.length === 0}
		<Card class="text-center py-12">
			<AlertTriangleIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
			<h3 class="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
			<p class="text-gray-600">
				{issues.length === 0
					? 'No issues have been reported yet.'
					: 'No issues match your current filters.'}
			</p>
		</Card>
	{:else}
		<!-- Issues Table -->
		<div class="shadow-lg rounded-lg bg-white p-4">
			<div class="overflow-x-auto">
				<Table>
					<TableHead>
						<TableHeadCell>Issue</TableHeadCell>
						<TableHeadCell>Room</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Priority</TableHeadCell>
						<TableHeadCell>Reporter</TableHeadCell>
						<TableHeadCell>Created</TableHeadCell>
						<TableHeadCell>Actions</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each filteredIssues as issue}
							<TableBodyRow>
								<TableBodyCell>
									<div class="max-w-xs">
										<p class="font-medium text-gray-900 truncate">{issue.title}</p>
										{#if issue.description}
											<p class="text-sm text-gray-600 truncate">{issue.description}</p>
										{/if}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="flex items-center space-x-2">
										<HomeIcon class="w-4 h-4 text-gray-500" />
										<span class="font-medium">
											{issue.room?.roomNumber || 'N/A'}
										</span>
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<Badge color={getIssueStatusColor(issue.status)} class="text-xs">
										{issue.status}
									</Badge>
								</TableBodyCell>
								<TableBodyCell>
									<Badge color={getIssuePriorityColor(issue.priority)} class="text-xs">
										{issue.priority}
									</Badge>
								</TableBodyCell>
								<TableBodyCell>
									<div class="flex items-center space-x-2">
										<Avatar size="xs" />
										<span class="text-sm">
											{issue.user?.name || issue?.user?.email || 'Unknown'}
										</span>
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="text-sm text-gray-600">
										{formatDateTime(issue.createdAt)}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="flex items-center space-x-2">
										<Button
											size="xs"
											color="blue"
											on:click={() => openViewModal(issue)}
											class="p-1"
										>
											<EyeIcon class="w-3 h-3" />
										</Button>
										<Button
											size="xs"
											color="yellow"
											on:click={() => openEditModal(issue)}
											class="p-1"
										>
											<EditIcon class="w-3 h-3" />
										</Button>
										{#if issue.status === 'OPEN'}
											<Button
												size="xs"
												color="green"
												on:click={() => quickUpdateStatus(issue.id, 'IN_PROGRESS')}
												class="p-1"
												title="Start Progress"
											>
												<PlayCircleIcon class="w-3 h-3" />
											</Button>
										{:else if issue.status === 'IN_PROGRESS'}
											<Button
												size="xs"
												color="green"
												on:click={() => quickUpdateStatus(issue.id, 'CLOSED')}
												class="p-1"
												title="Mark as Resolved"
											>
												<CheckCircleIcon class="w-3 h-3" />
											</Button>
										{:else if issue.status === 'CLOSED'}
											<Button size="xs" color="blue" class="p-1" title="Already Closed" disabled>
												<XCircleIcon class="w-3 h-3" />
											</Button>
										{/if}
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	{/if}
</div>

<!-- View Issue Modal -->
<Modal bind:open={viewIssueModal} size="lg" autoclose={false} class="w-full">
	{#if selectedIssue}
		<div class="space-y-6">
			<div class="flex justify-between items-start">
				<div>
					<h3 class="text-xl font-semibold text-gray-900">{selectedIssue.title}</h3>
					<div class="flex items-center space-x-2 mt-2">
						<Badge color={getIssueStatusColor(selectedIssue.status)}>
							{selectedIssue.status}
						</Badge>
						<Badge color={getIssuePriorityColor(selectedIssue.priority)}>
							{selectedIssue.priority} Priority
						</Badge>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h4 class="font-medium text-gray-900 mb-2">Issue Details</h4>
					<div class="space-y-3 text-sm">
						<div class="flex items-center space-x-2">
							<HomeIcon class="w-4 h-4 text-gray-500" />
							<span>Room: {selectedIssue.room?.roomNumber || 'N/A'}</span>
						</div>
						<div class="flex items-center space-x-2">
							<CalendarIcon class="w-4 h-4 text-gray-500" />
							<span>Created: {formatDateTime(selectedIssue.createdAt)}</span>
						</div>
						{#if selectedIssue.updatedAt !== selectedIssue.createdAt}
							<div class="flex items-center space-x-2">
								<ClockIcon class="w-4 h-4 text-gray-500" />
								<span>Updated: {formatDateTime(selectedIssue.updatedAt)}</span>
							</div>
						{/if}
						<div class="flex items-center space-x-2">
							<UserIcon class="w-4 h-4 text-gray-500" />
							<span
								>Reporter: {selectedIssue.reportedBy?.name ||
									selectedIssue.reportedBy?.email ||
									'Unknown'}</span
							>
						</div>
					</div>
				</div>

				<div>
					<h4 class="font-medium text-gray-900 mb-2">Booking Information</h4>
					{#if selectedIssue.booking}
						<div class="space-y-2 text-sm">
							<p>Booking ID: {selectedIssue.booking.id}</p>
							<p>Check-in: {formatDateTime(selectedIssue.booking.checkIn)}</p>
							<p>Check-out: {formatDateTime(selectedIssue.booking.checkOut)}</p>
							<p>Status: {selectedIssue.booking.status}</p>
						</div>
					{:else}
						<p class="text-sm text-gray-600">No booking information available</p>
					{/if}
				</div>
			</div>

			{#if selectedIssue.description}
				<div>
					<h4 class="font-medium text-gray-900 mb-2">Description</h4>
					<p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
						{selectedIssue.description}
					</p>
				</div>
			{/if}

			{#if selectedIssue.adminNotes}
				<div>
					<h4 class="font-medium text-gray-900 mb-2">Admin Notes</h4>
					<p class="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
						{selectedIssue.adminNotes}
					</p>
				</div>
			{/if}

			<div class="flex justify-end space-x-3 pt-4 border-t">
				<Button color="alternative" on:click={() => (viewIssueModal = false)}>Close</Button>
				<Button
					color="blue"
					on:click={() => {
						viewIssueModal = false;
						openEditModal(selectedIssue);
					}}
				>
					<EditIcon class="w-4 h-4 mr-2" />
					Edit Issue
				</Button>
			</div>
		</div>
	{/if}
</Modal>

<!-- Edit Issue Modal -->
<Modal bind:open={editIssueModal} size="lg" autoclose={false} class="w-full">
	{#if selectedIssue}
		<form on:submit|preventDefault={updateIssue} class="space-y-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Issue</h3>
			</div>

			<!-- Success/Error Message -->
			{#if updateMessage}
				<div
					class="p-4 rounded-lg {updateMessageType === 'success'
						? 'bg-green-50 border border-green-200'
						: 'bg-red-50 border border-red-200'}"
				>
					<div class="flex items-center">
						{#if updateMessageType === 'success'}
							<CheckCircleIcon class="w-5 h-5 text-green-600 mr-2" />
							<span class="text-green-700">{updateMessage}</span>
						{:else}
							<XCircleIcon class="w-5 h-5 text-red-600 mr-2" />
							<span class="text-red-700">{updateMessage}</span>
						{/if}
					</div>
				</div>
			{/if}

			<div>
				<Label for="edit-title" class="mb-2">Issue Title</Label>
				<Input
					type="text"
					id="edit-title"
					bind:value={editForm.title}
					disabled={updatingIssue}
					required
				/>
			</div>

			<div>
				<Label for="edit-description" class="mb-2">Description</Label>
				<Textarea
					id="edit-description"
					bind:value={editForm.description}
					rows="4"
					disabled={updatingIssue}
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="edit-status" class="mb-2">Status</Label>
					<Select id="edit-status" bind:value={editForm.status} disabled={updatingIssue}>
						<option value="OPEN">Open</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="CLOSED">Closed</option>
					</Select>
				</div>
				<div>
					<Label for="edit-priority" class="mb-2">Priority</Label>
					<Select id="edit-priority" bind:value={editForm.priority} disabled={updatingIssue}>
						<option value="LOW">Low</option>
						<option value="MEDIUM">Medium</option>
						<option value="HIGH">High</option>
					</Select>
				</div>
			</div>

			<div class="flex justify-end space-x-3 pt-4 border-t">
				<Button
					type="button"
					color="alternative"
					disabled={updatingIssue}
					on:click={() => (editIssueModal = false)}
				>
					Cancel
				</Button>
				<Button type="submit" color="blue" disabled={updatingIssue}>
					{#if updatingIssue}
						<Spinner class="mr-2" size="4" />
						Updating...
					{:else}
						<CheckCircleIcon class="w-4 h-4 mr-2" />
						Update Issue
					{/if}
				</Button>
			</div>
		</form>
	{/if}
</Modal>
