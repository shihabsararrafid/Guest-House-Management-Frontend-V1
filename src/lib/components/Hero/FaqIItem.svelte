<script lang="ts">
	import { Section, Faq, FaqItem } from 'flowbite-svelte-blocks';
</script>

<Section name="faq">
	<h2 class="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
		Frequently Asked Questions
	</h2>
	<Faq>
		<div>
			<FaqItem>
				<svelte:fragment slot="h3">Who can stay at the University Guest House?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					Our guest house is open to visiting faculty, conference attendees, parents of students,
					alumni, and other university-affiliated guests. Priority is given to official university
					visitors.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">How far in advance should I book my stay?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					We recommend booking at least 2-4 weeks in advance, especially during peak periods like
					graduation, homecoming, and the start of academic terms. However, last-minute bookings may
					be possible based on availability.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">What amenities are included in the room rate?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					Our room rates include free Wi-Fi, daily housekeeping, access to on-site laundry
					facilities, and use of common areas. Some room types also include a kitchenette.
				</p>
				<p class="text-gray-500 dark:text-gray-400">
					For a full list of amenities, please visit our <a
						href="/amenities"
						class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
						>Amenities page</a
					>.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">Is parking available for guests?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					Yes, we offer complimentary parking for all guests during their stay. Please note that
					spaces are limited and are available on a first-come, first-served basis.
				</p>
			</FaqItem>
		</div>
		<div>
			<FaqItem>
				<svelte:fragment slot="h3">What is your cancellation policy?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					Cancellations made at least 48 hours before the check-in date are eligible for a full
					refund. Cancellations made within 48 hours of the check-in date may be subject to a
					one-night charge. Please review our full <a
						href="/policies"
						class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
						>cancellation policy</a
					> for more details.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">Do you offer long-term stays?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					Yes, we offer discounted rates for extended stays of 7 nights or more. Please <a
						href="/contact"
						class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
						>contact us</a
					> directly for long-term stay inquiries and rates.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">Is breakfast included in the room rate?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					While breakfast is not included in the standard room rate, we offer a continental
					breakfast option for an additional fee. There's also a café on the premises that serves
					breakfast and lunch daily.
				</p>
			</FaqItem>
			<FaqItem>
				<svelte:fragment slot="h3">Are pets allowed in the guest house?</svelte:fragment>
				<p class="text-gray-500 dark:text-gray-400">
					We have a limited number of pet-friendly rooms available for an additional fee. These
					rooms must be booked in advance and are subject to availability.
				</p>
				<p class="text-gray-500 dark:text-gray-400">
					Please review our <a
						href="/pet-policy"
						class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
						>pet policy</a
					> for more information on restrictions and additional charges.
				</p>
			</FaqItem>
		</div>
	</Faq>
</Section>
