<script>
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		ImagePlaceholder,
		Skeleton,
		TextPlaceholder,
		Button
	} from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
</script>

<div class="relative px-8">
	<Navbar class="px-2 sm:px-4 py-2.5 fixed h-[80px] w-full z-20 top-0 start-0 border-b">
		<NavBrand href="/">
			<img src="/ruet-logo.jpeg" class="me-3 h-8 sm:h-9" alt="RUET Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Guest House</span
			>
		</NavBrand>
		<div class="flex md:order-2">
			<Button href="/login" size="sm">Get started</Button>
			<NavHamburger />
		</div>
		<NavUl {activeUrl} {activeClass} {nonActiveClass}>
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/pricing">Pricing</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl>
	</Navbar>
</div>
