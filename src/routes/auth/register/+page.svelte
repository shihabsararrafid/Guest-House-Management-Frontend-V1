<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import { Button, Checkbox, Input, Label } from 'flowbite-svelte';
	let phone = '';
	let password = '';
	let confirmPassword = '';
	let email = '';
	let username = '';
	let loading = false;
	const handleSubmit = async (event) => {
		event.preventDefault();

		// if (!validateForm()) return;

		loading = true;

		try {
			const response = await fetch('http://localhost:5000/api/v1/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					email,
					phone,
					password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Registration failed');
			}

			// Show success message
			toast.push('Registration successful!', {
				theme: {
					'--toastBackground': '#48BB78',
					'--toastColor': 'white'
				}
			});

			// Redirect to login
			goto('/auth/verify-email?message=asking-for-verification');
		} catch (error) {
			console.error('Registration error:', error);

			toast.push(error instanceof Error ? error.message : 'Registration failed', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastColor': 'white'
				}
			});
		} finally {
			loading = false;
		}
	};
</script>

<div class="mt-[100px]">
	<section class="h-[100vh-20px] flex items-center justify-center">
		<div
			class="max-w-md w-[400px] mx-auto px-8 py-8 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
		>
			<h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">Register</h2>
			<form on:submit={handleSubmit} class="mt-6 space-y-4">
				<div>
					<Label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Name</Label
					>
					<Input bind:value={username} type="text" id="name" placeholder="Your Name" required />
				</div>
				<div>
					<Label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Email address</Label
					>
					<Input
						bind:value={email}
						type="email"
						id="email"
						placeholder="name@example.com"
						required
					/>
				</div>
				<div>
					<Label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>phone Number</Label
					>
					<Input
						type="tel"
						id="phone"
						placeholder="01XXXXXXXXX"
						pattern="^01[3|5|6|7|8|9]{1}[0-9]{8}$"
						required
						bind:value={phone}
					/>
					<span class="text-red-500 text-xs">
						{#if !phone.match(/^01[3|5|6|7|8|9]{1}[0-9]{8}$/)}
							Please enter a valid Bangladeshi phone number (starting with 01 and 8 digits).
						{/if}
					</span>
				</div>
				<div>
					<Label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Password</Label
					>
					<Input
						type="password"
						id="password"
						placeholder="••••••••"
						required
						bind:value={password}
					/>
				</div>
				<div>
					<Label
						for="confirmPassword"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Confirm Password</Label
					>
					<Input
						type="password"
						id="confirmPassword"
						placeholder="••••••••"
						required
						bind:value={confirmPassword}
					/>
					<span class="text-red-500 text-xs">
						{#if password !== confirmPassword}
							Passwords must match.
						{/if}
					</span>
				</div>
				<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
					Already have an account? <a
						href="/login"
						class="text-blue-700 hover:underline dark:text-blue-500">Login</a
					>
				</p>
				<Button
					disabled={loading}
					type="submit"
					class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-md shadow-sm"
					>Register</Button
				>
			</form>
		</div>
	</section>
</div>
