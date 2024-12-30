<script lang="ts">
	import { Section, Contact } from 'flowbite-svelte-blocks';
	import { Label, Input, Textarea, Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toast } from '@zerodevx/svelte-toast';

	let email = '';
	let subject = '';
	let message = '';
	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	// Function to handle form submission
	const handleSubmit = async (e: Event) => {
		e.preventDefault(); // Prevent form from refreshing the page	isLoading = true;
		try {
			isLoading = true;
			const response = await fetch(`${PUBLIC_API_URL}/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, subject, body: message })
			});

			if (response.ok) {
				toast.push('Your message has been sent successfully', {
					theme: {
						'--toastBackground': '#48BB78',
						'--toastColor': 'white'
					}
				});
				successMessage = 'Your message has been sent successfully!';
				email = '';
				subject = '';
				message = '';
			} else {
				const errorData = await response.json();
				errorMessage = errorData.message || 'Failed to send your message.';
			}
		} catch (error) {
			errorMessage = 'An error occurred while sending your message.';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="mt-[200px]">
	<div class="flex flex-col items-center mb-10">
		<h2 class="text-5xl text-center">Contact Us</h2>
		<p class="text-center">
			Got a technical issue? Want to send feedback about a beta feature? Need details about our
			Business plan? Let us know.
		</p>
		<form
			class="space-y-8 w-full lg:w-1/2 shadow-xl shadow-slate-200 px-5 py-2"
			on:submit={handleSubmit}
		>
			<div>
				<Label for="email" class="block mb-2">Your email</Label>
				<Input
					id="email"
					name="email"
					placeholder="name@guesthouse.com"
					bind:value={email}
					required
				/>
			</div>
			<div>
				<Label for="subject" class="block mb-2">Subject</Label>
				<Input
					id="subject"
					name="subject"
					placeholder="Let us know how we can help you"
					bind:value={subject}
					required
				/>
			</div>
			<div>
				<Textarea
					id="message"
					name="message"
					placeholder="Leave a comment..."
					label="Your message"
					bind:value={message}
					required
				/>
			</div>
			<Button type="submit"
				>{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
					Sending...
				{:else}
					Send message
				{/if}</Button
			>
		</form>

		<!-- Success and error messages -->
		{#if successMessage}
			<p class="text-green-500 mt-4">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<p class="text-red-500 mt-4">{errorMessage}</p>
		{/if}
	</div>
</div>
