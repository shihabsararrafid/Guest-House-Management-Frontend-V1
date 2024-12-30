<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { Label, Input, Button, Select, Toggle } from 'flowbite-svelte';
	export let data;
	let user = (data as any).user;
	let error = '';
	let saving = false;
	let isEmailVerified = user.isEmailVerified ?? false;
	let roles = [
		{ value: 'USER', name: 'USER' },
		{ value: 'ADMIN', name: 'ADMIN' },
		{ value: 'RECEPTIONIST', name: 'RECEPTIONIST' }
	];
	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		error = '';
		const { firstName, lastName, department, role } = user;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/${user.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				},
				// body: JSON.stringify(newRoom),
				credentials: 'include',
				body: JSON.stringify({ firstName, lastName, department, role, isEmailVerified })
			});

			if (!response.ok) throw new Error('Failed to update user');
			goto('/admin/users');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown Error';
			console.error(err);
		} finally {
			saving = false;
		}
	}
</script>

<div class="container mx-auto p-4 max-w-2xl">
	<h1 class="text-2xl font-bold mb-4">Edit User</h1>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}
	{#if user}
		<form on:submit={handleSubmit} class="space-y-4">
			<div>
				<Label for="firstName">First Name</Label>
				<Input id="firstName" bind:value={user.firstName} required />
			</div>

			<div>
				<Label for="lastName">Last Name</Label>
				<Input id="lastName" bind:value={user.lastName} required />
			</div>

			<div>
				<Label for="email">Email</Label>
				<Input id="email" type="email" bind:value={user.email} required />
			</div>
			<div>
				<Label for="department">Role</Label>
				<Select id="role" items={roles} bind:value={user.role} />
			</div>
			<div>
				<Label for="department">Department</Label>
				<Input id="department" bind:value={user.department} />
			</div>
			<Toggle
				checked={user.isEmailVerified}
				on:change={(e) => {
					// @ts-ignore
					isEmailVerified = e?.target?.checked;
				}}>Email Verified</Toggle
			>
			<div class="flex gap-4 justify-end">
				<Button color="alternative" href="/admin/users">Cancel</Button>
				<Button type="submit" disabled={saving}>
					{saving ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</form>
	{/if}
</div>
