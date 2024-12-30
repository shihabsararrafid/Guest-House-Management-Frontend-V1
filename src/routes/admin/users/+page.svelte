<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import {
		Button,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { User } from './type';

	let users: User[] = [];
	let loading = true;
	let error = '';

	async function fetchUsers() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/admin/users`, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				// body: JSON.stringify(newRoom),
				credentials: 'include',
				method: 'GET'
			});
			if (!response.ok) throw new Error('Failed to fetch users');
			users = (await response.json())?.data;
			console.log(users);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown Error';
		} finally {
			loading = false;
		}
	}

	async function deleteUser(id: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				// body: JSON.stringify(newRoom),
				credentials: 'include',
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Failed to delete user');
			await fetchUsers(); // Refresh the list
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown Error';
		}
	}

	onMount(fetchUsers);
</script>

<div class="text-xl mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">User Management</h1>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex justify-center">
			<Spinner />
		</div>
	{:else}
		<Table>
			<TableHead>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Email</TableHeadCell>
				<TableHeadCell>Role</TableHeadCell>
				<TableHeadCell>Email Verified</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each users as user}
					<TableBodyRow>
						<TableBodyCell>
							{user.firstName ?? ''}
							{user.lastName ?? ''}
						</TableBodyCell>
						<TableBodyCell>
							{user.email}
						</TableBodyCell>
						<TableBodyCell>
							{user.role}
						</TableBodyCell>
						<TableBodyCell>
							{user.isEmailVerified ? 'Yes' : 'No'}
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button size="xs" href="/admin/users/{user.id}/edit">Edit</Button>
								<Button size="xs" color="red" on:click={() => deleteUser(user.id)}>Delete</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>
