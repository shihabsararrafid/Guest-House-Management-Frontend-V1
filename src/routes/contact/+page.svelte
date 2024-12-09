<script lang="ts">
	import { Section, Contact } from 'flowbite-svelte-blocks';
	import { Label, Input, Textarea, Button } from 'flowbite-svelte';
</script>

<div class="mt-[200px]">
	<div class="flex flex-col items-center mb-10">
		<h2 class="text-5xl text-center">Contact Us</h2>
		<p class="text-center">
			Got a technical issue? Want to send feedback about a beta feature? Need details about our
			Business plan? Let us know.
		</p>
		<form class="space-y-8 lg:w-1/2 shadow-xl shadow-slate-200 px-5 py-2">
			<div>
				<Label for="email" class="block mb-2">Your email</Label>
				<Input id="email" name="email" placeholder="name@guesthouse.com" required />
			</div>
			<div>
				<Label for="subject" class="block mb-2">Subject</Label>
				<Input id="subject" name="subject" placeholder="Let us know how we can help you" required />
			</div>
			<div>
				<Textarea
					id="subject"
					name="subject"
					placeholder="Leave a comment..."
					label="Your message"
				/>
			</div>
			<Button>Send message</Button>
		</form>
	</div>
</div>
