<!-- routes/admin/rooms/+page.svelte -->
<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { NewRoom, Room } from '$lib/types/Rooms';
	import { toast } from '@zerodevx/svelte-toast';
	import { Input, Label } from 'flowbite-svelte';
	import {
		Edit,
		Edit2,
		Plus,
		Search,
		Trash2,
		Tv,
		Wifi,
		Wind,
		Calendar,
		CheckCircle
	} from 'lucide-svelte';
	export let data;
	let searchQuery = '';
	let showAddModal = false;
	let loading = false;
	let editingRoom: Room | null = null;
	let updatingRoomStatus: { [key: string]: boolean } = {}; // Track which rooms are being updated

	// Enums from schema
	// Define the enums directly in the component if you haven't set up the types file
	enum RoomType {
		SINGLE = 'SINGLE',
		DOUBLE = 'DOUBLE',
		TWIN = 'TWIN',
		SUITE = 'SUITE',
		DELUXE = 'DELUXE',
		PRESIDENTIAL = 'PRESIDENTIAL'
	}

	enum RoomStatus {
		AVAILABLE = 'AVAILABLE',
		OCCUPIED = 'OCCUPIED',
		MAINTENANCE = 'MAINTENANCE',
		RESERVED = 'RESERVED',
		CLEANING = 'CLEANING'
	}

	enum BedType {
		SINGLE = 'SINGLE',
		DOUBLE = 'DOUBLE',
		QUEEN = 'QUEEN',
		KING = 'KING',
		TWIN = 'TWIN'
	}

	// Define arrays directly instead of using Object.values
	const roomTypes = [
		RoomType.SINGLE,
		RoomType.DOUBLE,
		RoomType.TWIN,
		RoomType.SUITE,
		RoomType.DELUXE,
		RoomType.PRESIDENTIAL
	];

	const roomStatuses = [
		RoomStatus.AVAILABLE,
		RoomStatus.OCCUPIED,
		RoomStatus.MAINTENANCE,
		RoomStatus.RESERVED,
		RoomStatus.CLEANING
	];

	const bedTypes = [BedType.SINGLE, BedType.DOUBLE, BedType.QUEEN, BedType.KING, BedType.TWIN];

	let newRoom: NewRoom = {
		roomNumber: '',
		roomName: '',
		type: RoomType.SINGLE,
		status: RoomStatus.AVAILABLE,
		floor: 1,
		capacity: 2,
		pricePerNight: 100,
		hasWifi: true,
		hasAC: true,
		hasTv: true,
		hasRefrigerator: true,
		description: '',
		beds: [{ bedType: BedType.SINGLE, quantity: 1, capacity: 1 }],
		viewType: '',
		squareFootage: 1
	};

	let rooms: Room[] = [
		{
			id: '1',
			roomNumber: '101',
			roomName: 'Ocean View Suite',
			type: RoomType.SUITE,
			status: RoomStatus.AVAILABLE,
			pricePerNight: 299,
			floor: 1,
			capacity: 2,
			hasWifi: true,
			hasAC: true,
			hasTv: true,
			hasRefrigerator: true,
			description: '',
			beds: [{ bedType: BedType.KING, quantity: 1, capacity: 2 }],
			viewType: 'Ocean View',
			squareFootage: 450
		}
	];

	let selectedType: RoomType | '' = '';
	let selectedStatus: RoomStatus | '' = '';

	$: filteredRooms = (data?.rooms ?? []).filter((room) => {
		const matchesSearch =
			room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.roomName.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = !selectedType || room.type === selectedType;
		const matchesStatus = !selectedStatus || room.status === selectedStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	function resetForm(): void {
		newRoom = {
			roomNumber: '',
			roomName: '',
			type: RoomType.SINGLE,
			status: RoomStatus.AVAILABLE,
			floor: 1,
			capacity: 2,
			pricePerNight: 0,
			hasWifi: true,
			hasAC: true,
			hasTv: true,
			hasRefrigerator: true,
			description: '',
			beds: [{ bedType: BedType.SINGLE, quantity: 1, capacity: 1 }],
			viewType: '',
			squareFootage: 0
		};
		editingRoom = null;
	}

	async function handleAddRoom(): Promise<void> {
		try {
			loading = true;
			// Add API call here
			const response = await fetch(`${PUBLIC_API_URL}/room/create-room`, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				body: JSON.stringify(newRoom),
				credentials: 'include',
				method: 'POST'
			});
			if (response.ok) {
				invalidate(`${PUBLIC_API_URL}/room/get-all-rooms`);
			}
			const data = await response.json();

			// Temporary: just add to local array
			const roomToAdd: Room = { ...newRoom, id: String(rooms.length + 1) };
			console.log(roomToAdd, 'new room');
			rooms = [...rooms, roomToAdd];
			showAddModal = false;
			toast.push('Room addition Successful!', {
				theme: {
					'--toastBackground': '#48BB78',
					'--toastColor': 'white'
				}
			});
			resetForm();
		} catch (error) {
			// Show success message
			toast.push('Failed to Add Room!', {
				theme: {
					'--toastBackground': 'red',
					'--toastColor': 'white'
				}
			});
			console.error('Error adding room:', error);
		} finally {
			loading = false;
		}
	}

	function handleEdit(room: Room): void {
		editingRoom = room;
		newRoom = { ...room };
		showAddModal = true;
		console.log('here');
	}

	async function handleDeleteRoom(id: string): Promise<void> {
		if (confirm('Are you sure you want to delete this room?')) {
			try {
				const response = await fetch(`${PUBLIC_API_URL}/room/${id}`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					// body: JSON.stringify(newRoom),
					credentials: 'include',
					method: 'DELETE'
				});
				if (response.ok) {
					toast.push('Room Deleted !', {
						theme: {
							'--toastBackground': '#48BB78',
							'--toastColor': 'white'
						}
					});
					invalidate(`${PUBLIC_API_URL}/room/get-all-rooms`);
				}
			} catch (error) {
				toast.push('Failed to Delete Room!', {
					theme: {
						'--toastBackground': 'red',
						'--toastColor': 'white'
					}
				});
				console.error('Error deleting room:', error);
			}
		}
	}

	// Quick reserve room function
	async function handleQuickReserve(roomId: string): Promise<void> {
		if (confirm('Are you sure you want to reserve this room?')) {
			try {
				// Set loading state for this specific room
				updatingRoomStatus = { ...updatingRoomStatus, [roomId]: true };

				const response = await fetch(`${PUBLIC_API_URL}/room/${roomId}`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					body: JSON.stringify({ status: RoomStatus.RESERVED }),
					credentials: 'include',
					method: 'PATCH'
				});

				if (response.ok) {
					toast.push('Room Reserved Successfully!', {
						theme: {
							'--toastBackground': '#48BB78',
							'--toastColor': 'white'
						}
					});
					// Refresh the rooms data
					invalidate(`${PUBLIC_API_URL}/room/get-all-rooms`);
				} else {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Failed to reserve room');
				}
			} catch (error) {
				toast.push('Failed to Reserve Room!', {
					theme: {
						'--toastBackground': 'red',
						'--toastColor': 'white'
					}
				});
				console.error('Error reserving room:', error);
			} finally {
				// Remove loading state for this room
				updatingRoomStatus = { ...updatingRoomStatus, [roomId]: false };
			}
		}
	}

	// Quick make available function
	async function handleQuickMakeAvailable(roomId: string): Promise<void> {
		if (confirm('Are you sure you want to make this room available?')) {
			try {
				// Set loading state for this specific room
				updatingRoomStatus = { ...updatingRoomStatus, [roomId]: true };

				const response = await fetch(`${PUBLIC_API_URL}/room/${roomId}`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					},
					body: JSON.stringify({ status: RoomStatus.AVAILABLE }),
					credentials: 'include',
					method: 'PATCH'
				});

				if (response.ok) {
					toast.push('Room Made Available Successfully!', {
						theme: {
							'--toastBackground': '#48BB78',
							'--toastColor': 'white'
						}
					});
					// Refresh the rooms data
					invalidate(`${PUBLIC_API_URL}/room/get-all-rooms`);
				} else {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Failed to make room available');
				}
			} catch (error) {
				toast.push('Failed to Make Room Available!', {
					theme: {
						'--toastBackground': 'red',
						'--toastColor': 'white'
					}
				});
				console.error('Error making room available:', error);
			} finally {
				// Remove loading state for this room
				updatingRoomStatus = { ...updatingRoomStatus, [roomId]: false };
			}
		}
	}

	function addBed(): void {
		newRoom.beds = [...newRoom.beds, { bedType: BedType.SINGLE, quantity: 1, capacity: 1 }];
	}

	function removeBed(index: number): void {
		newRoom.beds = newRoom.beds.filter((_, i) => i !== index);
	}

	// Function to check if room can be reserved
	function canReserveRoom(status: RoomStatus): boolean {
		return status === RoomStatus.AVAILABLE || status === RoomStatus.CLEANING;
	}
</script>

<div>
	<!-- Header -->
	<div class="flex flex-wrap justify-between items-center mb-6">
		<h1 class="text-2xl font-bold text-gray-800">Room Management</h1>
		<button
			on:click={() => {
				resetForm();
				showAddModal = true;
			}}
			class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
		>
			<Plus class="w-5 h-5" />
			Add Room
		</button>
	</div>

	<!-- Search and Filters -->
	<div class="bg-white p-4 rounded-lg shadow mb-6">
		<div class="flex flex-wrap gap-4">
			<div class="relative flex-1">
				<Search class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search rooms..."
					class="pl-10 pr-4 py-2 border rounded-lg w-full"
				/>
			</div>
			<select bind:value={selectedType} class="border rounded-lg px-4 py-2">
				<option value="">All Types</option>
				{#each roomTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
			<select bind:value={selectedStatus} class="border rounded-lg px-4 py-2">
				<option value="">All Statuses</option>
				{#each roomStatuses as status}
					<option value={status}>{status}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Room Table -->
	<div class="w-full overflow-x-auto">
		<div class="p-6 bg-white rounded-lg shadow min-w-[800px]">
			<!-- <div class="bg-white rounded-lg shadow overflow-hidden"> -->
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Room</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Type</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Floor</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Status</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Amenities</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Price</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each filteredRooms as room}
						<tr>
							<td class="px-6 py-4">
								<div>
									<div class="font-medium">{room.roomNumber}</div>
									<div class="text-sm text-gray-500">{room.roomName ?? ''}</div>
								</div>
							</td>
							<td class="px-6 py-4">{room.type}</td>
							<td class="px-6 py-4">{room.floor}</td>
							<td class="px-6 py-4">
								<span
									class="px-2 py-1 text-sm rounded-full
                  {room.status === 'AVAILABLE'
										? 'bg-green-100 text-green-800'
										: room.status === 'OCCUPIED'
											? 'bg-red-100 text-red-800'
											: room.status === 'MAINTENANCE'
												? 'bg-yellow-100 text-yellow-800'
												: room.status === 'RESERVED'
													? 'bg-blue-100 text-blue-800'
													: room.status === 'CLEANING'
														? 'bg-purple-100 text-purple-800'
														: 'bg-gray-100 text-gray-800'}"
								>
									{room.status}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="flex gap-2">
									{#if room.hasWifi}<Wifi class="w-4 h-4 text-blue-500" />{/if}
									{#if room.hasAC}<Wind class="w-4 h-4 text-blue-500" />{/if}
									{#if room.hasTv}<Tv class="w-4 h-4 text-blue-500" />{/if}
									{#if room.hasRefrigerator}<div class="text-blue-500 text-sm">🧊</div>{/if}
								</div>
							</td>
							<td class="px-6 py-4"> BDT {room.pricePerNight}</td>
							<td class="px-6 py-4">
								<div class="flex gap-2">
									<!-- Quick Reserve Button (for AVAILABLE/CLEANING rooms) -->
									{#if canReserveRoom(room.status)}
										<button
											class="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
											on:click={() => handleQuickReserve(room.id)}
											disabled={updatingRoomStatus[room.id]}
											title="Quick Reserve"
										>
											{#if updatingRoomStatus[room.id]}
												<div
													class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
												></div>
											{:else}
												<Calendar class="w-5 h-5" />
											{/if}
										</button>
									{/if}

									<!-- Quick Make Available Button (for RESERVED rooms) -->
									{#if room.status === RoomStatus.RESERVED}
										<button
											class="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
											on:click={() => handleQuickMakeAvailable(room.id)}
											disabled={updatingRoomStatus[room.id]}
											title="Make Available"
										>
											{#if updatingRoomStatus[room.id]}
												<div
													class="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"
												></div>
											{:else}
												<CheckCircle class="w-5 h-5" />
											{/if}
										</button>
									{/if}

									<!-- Edit Button -->
									<button
										class="text-blue-600 hover:text-blue-800"
										on:click={() => handleEdit(room)}
										title="Edit Room"
									>
										<Edit class="w-5 h-5" />
									</button>

									<!-- Delete Button -->
									<button
										class="text-red-600 hover:text-red-800"
										on:click={() => handleDeleteRoom(room.id)}
										title="Delete Room"
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

	<!-- Add/Edit Room Modal -->
	{#if showAddModal}
		<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
			<div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
				<h3 class="text-lg font-bold mb-4">
					{editingRoom ? 'Edit Room' : 'Add New Room'}
				</h3>

				<div class="grid grid-cols-2 gap-4">
					<!-- Basic Info -->
					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Room Number*</Label>
						<Input
							type="text"
							bind:value={newRoom.roomNumber}
							class="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Room Name</Label>
						<input
							type="text"
							bind:value={newRoom.roomName}
							class="w-full px-3 py-2 border rounded-lg"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Room Type*</Label>
						<select bind:value={newRoom.type} class="w-full px-3 py-2 border rounded-lg" required>
							{#each roomTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Status*</Label>
						<select bind:value={newRoom.status} class="w-full px-3 py-2 border rounded-lg" required>
							{#each roomStatuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Floor*</Label>
						<input
							type="number"
							bind:value={newRoom.floor}
							min="1"
							class="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Price per Night*</Label>
						<input
							type="number"
							bind:value={newRoom.pricePerNight}
							min="0"
							class="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">Square Footage</Label>
						<input
							type="number"
							bind:value={newRoom.squareFootage}
							min="1"
							class="w-full px-3 py-2 border rounded-lg"
						/>
					</div>

					<div>
						<Label class="block text-sm font-medium text-gray-700 mb-1">View Type</Label>
						<input
							type="text"
							bind:value={newRoom.viewType}
							class="w-full px-3 py-2 border rounded-lg"
							placeholder="e.g., Ocean View, Garden View"
						/>
					</div>
				</div>

				<!-- Beds Section -->
				<div class="mt-6">
					<div class="flex justify-between items-center mb-2">
						<Label class="block text-sm font-medium text-gray-700">Beds</Label>
						<button
							type="button"
							on:click={addBed}
							class="text-sm text-blue-600 hover:text-blue-800"
						>
							+ Add Bed
						</button>
					</div>

					{#each newRoom.beds as bed, index}
						<div class="grid grid-cols-3 gap-4 mb-4">
							<div>
								<select bind:value={bed.bedType} class="w-full px-3 py-2 border rounded-lg">
									{#each bedTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>
							<div>
								<input
									type="number"
									bind:value={bed.quantity}
									min="1"
									placeholder="Quantity"
									class="w-full px-3 py-2 border rounded-lg"
								/>
							</div>
							<div class="flex items-center gap-2">
								<input
									type="number"
									bind:value={bed.capacity}
									min="1"
									placeholder="Capacity"
									class="w-full px-3 py-2 border rounded-lg"
								/>
								<button
									type="button"
									on:click={() => removeBed(index)}
									class="text-red-600 hover:text-red-800"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- Amenities Section -->
				<div class="mt-6">
					<Label class="block text-sm font-medium text-gray-700 mb-2">Amenities</Label>
					<div class="grid grid-cols-2 gap-4">
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={newRoom.hasWifi}
								id="wifi"
								class="w-4 h-4 text-blue-600"
							/>
							<Label for="wifi" class="flex items-center gap-2">
								<Wifi class="w-4 h-4" /> Wi-Fi
							</Label>
						</div>

						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={newRoom.hasAC}
								id="ac"
								class="w-4 h-4 text-blue-600"
							/>
							<Label for="ac" class="flex items-center gap-2">
								<Wind class="w-4 h-4" /> Air Conditioning
							</Label>
						</div>

						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={newRoom.hasTv}
								id="tv"
								class="w-4 h-4 text-blue-600"
							/>
							<Label for="tv" class="flex items-center gap-2">
								<Tv class="w-4 h-4" /> Television
							</Label>
						</div>

						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={newRoom.hasRefrigerator}
								id="fridge"
								class="w-4 h-4 text-blue-600"
							/>
							<Label for="fridge" class="flex items-center gap-2">🧊 Refrigerator</Label>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div class="mt-6">
					<Label class="block text-sm font-medium text-gray-700 mb-1">Description</Label>
					<textarea
						bind:value={newRoom.description}
						rows="3"
						class="w-full px-3 py-2 border rounded-lg"
						placeholder="Add room description..."
					></textarea>
				</div>

				<!-- Form Actions -->
				<div class="flex justify-end gap-2 mt-6">
					<button
						type="button"
						on:click={() => {
							showAddModal = false;
							resetForm();
						}}
						class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
						disabled={loading}
					>
						Cancel
					</button>
					<button
						type="button"
						on:click={handleAddRoom}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						disabled={loading}
					>
						{#if loading}
							<span class="flex items-center gap-2">
								<div
									class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
								></div>
								{editingRoom ? 'Updating...' : 'Adding...'}
							</span>
						{:else}
							{editingRoom ? 'Update Room' : 'Add Room'}
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
