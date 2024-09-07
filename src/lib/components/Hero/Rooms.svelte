<script lang="ts">
	import {
		Section,
		PricingBodyHead,
		PricingCard,
		PricingItemWrapper,
		PricingHead,
		PricingItem
	} from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
</script>

<Section name="pricing">
	<PricingHead>
		<svelte:fragment slot="h2">Comfortable Accommodations for Every Need</svelte:fragment>
		<svelte:fragment slot="paragraph"
			>Our university guest house offers a range of room types to suit various preferences and
			budgets, ensuring a pleasant stay for all our guests.</svelte:fragment
		>
	</PricingHead>
	<div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
		<PricingCard
			divClass="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
		>
			<PricingBodyHead>
				<svelte:fragment slot="h3">Standard Room</svelte:fragment>
				<svelte:fragment slot="paragraph"
					>Ideal for short stays and individual travelers.</svelte:fragment
				>
				<svelte:fragment slot="price">
					<span class="mr-2 text-5xl font-extrabold">$79</span>
					<span class="text-gray-500 dark:text-gray-400">/night</span>
				</svelte:fragment>
			</PricingBodyHead>
			<PricingItemWrapper>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Single or double bed</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>En-suite bathroom</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Free Wi-Fi</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Desk and chair</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Daily housekeeping</span>
				</PricingItem>

				<svelte:fragment slot="btn">
					<Button color="blue">Book Now</Button>
				</svelte:fragment>
			</PricingItemWrapper>
		</PricingCard>

		<PricingCard>
			<PricingBodyHead>
				<svelte:fragment slot="h3">Deluxe Room</svelte:fragment>
				<svelte:fragment slot="paragraph"
					>Perfect for extended stays or those seeking extra comfort.</svelte:fragment
				>
				<svelte:fragment slot="price">
					<span class="mr-2 text-5xl font-extrabold">$119</span>
					<span class="text-gray-500 dark:text-gray-400">/night</span>
				</svelte:fragment>
			</PricingBodyHead>
			<PricingItemWrapper>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Queen-sized bed</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Spacious en-suite bathroom</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Free Wi-Fi</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Work area with ergonomic chair</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Mini-fridge and coffee maker</span>
				</PricingItem>

				<svelte:fragment slot="btn">
					<Button color="blue">Book Now</Button>
				</svelte:fragment>
			</PricingItemWrapper>
		</PricingCard>

		<PricingCard>
			<PricingBodyHead>
				<svelte:fragment slot="h3">Suite</svelte:fragment>
				<svelte:fragment slot="paragraph"
					>Ideal for families or those requiring more space.</svelte:fragment
				>
				<svelte:fragment slot="price">
					<span class="mr-2 text-5xl font-extrabold">$159</span>
					<span class="text-gray-500 dark:text-gray-400">/night</span>
				</svelte:fragment>
			</PricingBodyHead>
			<PricingItemWrapper>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Separate bedroom and living area</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>King-sized bed</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Kitchenette</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Complimentary breakfast</span>
				</PricingItem>
				<PricingItem class="text-green-500 dark:text-green-400">
					<span>Access to business center</span>
				</PricingItem>

				<svelte:fragment slot="btn">
					<Button color="blue">Book Now</Button>
				</svelte:fragment>
			</PricingItemWrapper>
		</PricingCard>
	</div>
</Section>
