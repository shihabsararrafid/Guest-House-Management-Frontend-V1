<script>
	import {
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup
	} from 'flowbite-svelte';
</script>

<Footer footerType="socialmedia">
	<div class="grid gap-12 lg:grid-cols-6 lg:gap-24">
		<div class="col-span-2">
			<FooterBrand
				href="https://flowbite.com"
				src="/ruet-logo.jpeg"
				alt="Ruet Logo"
				name="Ruet Guest House"
				aClass="flex mb-6"
			/>
			<p class="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-4">
				Our university guest house offers comfortable accommodations for visiting scholars, alumni,
				and guests. Enjoy modern amenities, a prime campus location, and a welcoming academic
				atmosphere during your stay.
			</p>
		</div>
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">Resources</h2>
			<FooterLinkGroup>
				<FooterLink liClass="mb-4" href="https://ruet.ac.bd/">RUET</FooterLink>
				<FooterLink liClass="mb-4" href="https://tailwindcss.com/">Tailwind CSS</FooterLink>
				<FooterLink liClass="mb-4" href="https://flowbite-svelte.com/">Flowbite-Svelte</FooterLink>
			</FooterLinkGroup>
		</div>
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
				HELP & SUPPORT
			</h2>
			<FooterLinkGroup>
				<FooterLink liClass="mb-4" href="https://www.facebook.com">Facebook</FooterLink>
				<FooterLink liClass="mb-4" href="https://web.whatsapp.com">WhatsApp</FooterLink>
			</FooterLinkGroup>
		</div>
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">Follow us</h2>
			<FooterLinkGroup>
				<FooterLink liClass="mb-4" href="https://github.com/shinokada/flowbite-svelte-blocks"
					>Facebook</FooterLink
				>
				<FooterLink liClass="mb-4" href="https://discord.gg/4eeurUVvTy">X</FooterLink>
			</FooterLinkGroup>
		</div>
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">Legal</h2>
			<FooterLinkGroup>
				<FooterLink
					liClass="mb-4"
					href="https://github.com/themesberg/flowbite-svelte-blocks/blob/main/License"
					>LICENSE</FooterLink
				>
			</FooterLinkGroup>
		</div>
	</div>
	<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
	<div class="sm:flex sm:items-center sm:justify-between">
		<FooterCopyright href="/" by="Guest House" />
		<!-- <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
			<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" icon={Facebook} />
			<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" icon={Instagram} />
			<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" icon={Twitter} />
			<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" icon={Github} />
		</div> -->
	</div>
</Footer>
