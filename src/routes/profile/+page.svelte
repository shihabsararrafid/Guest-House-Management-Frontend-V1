<script lang="ts">
	import { Alert, Badge, Button, Card, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import { PUBLIC_API_URL } from '$env/static/public';
	import type { UserExtended } from '../admin/users/type';

	let user: UserExtended | null = null;
	let loading = true;
	let error = '';
	let successMessage = '';
	let isEditing = false;

	let editForm = {
		firstName: '',
		lastName: '',
		username: '',
		department: '',
		currentPosition: '',
		phone: '',
		address: '',
		thana: '',
		district: ''
	};

	async function fetchProfile() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/profile`, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				// body: JSON.stringify(newRoom),
				credentials: 'include',
				method: 'GET'
			});

			if (!response.ok) throw new Error('Failed to fetch profile');

			user = (await response.json())?.data;
			// Populate edit form
			editForm = {
				firstName: user?.firstName || '',
				lastName: user?.lastName || '',
				username: user?.username || '',
				department: user?.department || '',
				currentPosition: user?.currentPosition || '',
				phone: user?.phone || '',
				address: user?.address || '',
				thana: user?.thana || '',
				district: user?.district || ''
			};
		} catch (err) {
			error = 'Failed to load profile';
		} finally {
			loading = false;
		}
	}

	async function updateProfile() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/profile`, {
				method: 'PATCH',

				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				// body: JSON.stringify(newRoom),
				credentials: 'include',
				// method: 'GET',

				body: JSON.stringify(editForm)
			});

			if (!response.ok) throw new Error('Failed to update profile');

			successMessage = 'Profile updated successfully';
			isEditing = false;
			await fetchProfile();
		} catch (err) {
			error = 'Failed to update profile';
		}
	}

	onMount(fetchProfile);
</script>

<div class="mx-auto p-4">
	<h1 class="text-3xl font-bold mb-6">My Profile</h1>

	{#if error}
		<Alert color="red" class="mb-4">
			{error}
		</Alert>
	{/if}

	{#if successMessage}
		<Alert color="green" class="mb-4">
			{successMessage}
		</Alert>
	{/if}

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div
				class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"
			></div>
		</div>
	{:else if user}
		<div class="w-full mt-14 border-[1px] border-slate-300 shadow-xl py-2 px-4">
			<!-- Basic Information Card -->
			<div class="w-full">
				<div class="flex justify-between items-start mb-4">
					<h2 class="text-xl font-semibold">Basic Information</h2>
					<Button size="xs" on:click={() => (isEditing = !isEditing)}>
						{isEditing ? 'Cancel' : 'Edit Profile'}
					</Button>
				</div>

				{#if isEditing}
					<form on:submit|preventDefault={updateProfile} class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="firstName">First Name</Label>
								<Input
									id="firstName"
									bind:value={editForm.firstName}
									placeholder="Enter your first name"
								/>
							</div>

							<div>
								<Label for="lastName">Last Name</Label>
								<Input
									id="lastName"
									bind:value={editForm.lastName}
									placeholder="Enter your last name"
								/>
							</div>

							<div>
								<Label for="username">Username</Label>
								<Input
									id="username"
									bind:value={editForm.username}
									placeholder="Enter your username"
								/>
							</div>

							<div>
								<Label for="department">Department</Label>
								<Input
									id="department"
									bind:value={editForm.department}
									placeholder="Enter your department"
								/>
							</div>

							<div>
								<Label for="currentPosition">Current Position</Label>
								<Input
									id="currentPosition"
									bind:value={editForm.currentPosition}
									placeholder="Enter your current position"
								/>
							</div>

							<div>
								<Label for="phone">Phone</Label>
								<Input
									id="phone"
									bind:value={editForm.phone}
									placeholder="Enter your phone number"
								/>
							</div>
						</div>

						<!-- Address Section -->
						<div class="mt-4">
							<Label for="address">Address</Label>
							<Input id="address" bind:value={editForm.address} placeholder="Enter your address" />
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="thana">Thana</Label>
								<Input id="thana" bind:value={editForm.thana} placeholder="Enter your thana" />
							</div>

							<div>
								<Label for="district">District</Label>
								<Input
									id="district"
									bind:value={editForm.district}
									placeholder="Enter your district"
								/>
							</div>
						</div>

						<div class="flex justify-end gap-2">
							<Button type="submit" color="primary">Save Changes</Button>
						</div>
					</form>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
						<div>
							<p class="text-sm text-gray-600">Full Name</p>
							<p class="font-medium">{user.firstName || '-'} {user.lastName || '-'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-600">Email</p>
							<p class="font-medium">{user.email}</p>
						</div>

						<div>
							<p class="text-sm text-gray-600">Username</p>
							<p class="font-medium">{user.username || '-'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-600">Department</p>
							<p class="font-medium">{user.department || '-'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-600">Current Position</p>
							<p class="font-medium">{user.currentPosition || '-'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-600">Account Status</p>
							<Badge color={user.isActive ? 'green' : 'red'}>
								{user.isActive ? 'Active' : 'Inactive'}
							</Badge>
						</div>
					</div>
				{/if}
			</div>

			<!-- Account Information Card -->
			<div class=" p-2">
				<h2 class="text-xl font-semibold mb-4">Account Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
					<div>
						<p class="text-sm text-gray-600">Role</p>
						<Badge color="blue">{user.role}</Badge>
					</div>

					<div>
						<p class="text-sm text-gray-600">Email Verification</p>
						<Badge color={user.isEmailVerified ? 'green' : 'yellow'}>
							{user.isEmailVerified ? 'Verified' : 'Pending Verification'}
						</Badge>
					</div>

					<div>
						<p class="text-sm text-gray-600">Created At</p>
						<p class="font-medium">
							{new Date(user.createdAt).toLocaleDateString()}
						</p>
					</div>

					<div>
						<p class="text-sm text-gray-600">Last Login</p>
						<p class="font-medium">
							{user.lastLoggedIn ? new Date(user.lastLoggedIn).toLocaleDateString() : 'Never'}
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
