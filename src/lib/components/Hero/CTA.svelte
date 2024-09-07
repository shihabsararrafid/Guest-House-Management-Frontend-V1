<script lang="ts">
	import { Section, Cta } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
	import { CalendarEditSolid, PhoneSolid } from 'flowbite-svelte-icons';
</script>

<Section name="cta" class="bg-gray-50 dark:bg-gray-800">
	<Cta>
		<svelte:fragment slot="h2">Experience comfort and convenience on campus.</svelte:fragment>
		<p class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
			Our University Guest House offers a perfect blend of comfort and accessibility for visitors,
			alumni, and academic guests. Enjoy modern amenities, proximity to campus facilities, and a
			welcoming atmosphere that makes your stay memorable. Whether you're here for a conference,
			campus visit, or alumni event, we're here to make your stay exceptional.
		</p>
		<div class="flex flex-wrap items-center gap-4">
			<Button href="/booking" color="blue" size="lg">
				<CalendarEditSolid class="mr-2 -ml-1" size="sm" />
				Book Now
			</Button>
			<Button href="/facilities" color="light" size="lg">
				<PhoneSolid class="mr-2 -ml-1" size="sm" />
				Contact Us
			</Button>
		</div>
	</Cta>
</Section>
