<script lang="ts">
	import { Section, HeroHeader, FeatureDefault, FeatureItem } from 'flowbite-svelte-blocks';
	import {
		HomeSolid,
		MapPinAltSolid,
		UsersSolid,
		CalendarWeekSolid,
		PhoneSolid
	} from 'flowbite-svelte-icons';
	import WifiSvg from './WifiSvg.svelte';
</script>

<Section name="feature">
	<HeroHeader
		class="max-w-screen-md mb-8 lg:mb-16"
		h2Class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
		pClass="text-gray-500 sm:text-xl dark:text-gray-400"
	>
		<svelte:fragment slot="h2">Welcome to University Guest House</svelte:fragment>
		<svelte:fragment slot="paragraph"
			>Experience comfort and convenience during your stay on campus. Our guest house offers a range
			of amenities to make your visit memorable and productive.</svelte:fragment
		>
	</HeroHeader>
	<FeatureDefault divClass="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
		<FeatureItem>
			<svelte:fragment slot="icon"
				><HomeSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Comfortable Rooms</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Enjoy well-appointed rooms with modern furnishings, ensuring a restful stay for all our
				guests.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><MapPinAltSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Prime Location</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Conveniently located on campus, providing easy access to university facilities and local
				attractions.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><UsersSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Community Spaces</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Access to common areas and lounges, perfect for socializing or collaborative work.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><WifiSvg class_="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Free Wi-Fi</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Stay connected with complimentary high-speed internet access throughout the guest house.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><CalendarWeekSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Easy Booking</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Streamlined reservation process for both short-term and extended stays to accommodate
				various needs.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><PhoneSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">24/7 Support</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Round-the-clock assistance to ensure a comfortable and worry-free stay for all our guests.</svelte:fragment
			>
		</FeatureItem>
	</FeatureDefault>
</Section>
