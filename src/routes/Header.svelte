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
		Button,
		Avatar,
		Dropdown,
		DropdownDivider,
		DropdownItem
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';

	/**
	 * @type {{ username: string | number | boolean; email: any; } | null}
	 */
	let userInfo = null;

	onMount(() => {
		try {
			const cookieValue = document.cookie
				.split('; ')
				.find((row) => row.startsWith('user_info='))
				?.split('=')[1];
			console.log(document.cookie);
			if (cookieValue) {
				userInfo = JSON.parse(decodeURIComponent(cookieValue));
			}
		} catch (error) {
			console.error('Error parsing user info from cookie:', error);
		}
	});

	const handleLogout = () => {
		// Clear the cookie
		document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		// Redirect to home or login page
		window.location.href = '/auth/login';
	};
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
			{#if userInfo}
				<div class="flex items-center">
					<Avatar
						id="user-drop"
						src="https://ui-avatars.com/api/?name={encodeURIComponent(userInfo.username)}"
						rounded
					/>
					<Dropdown triggeredBy="#user-drop">
						<div class="px-4 py-3">
							<span class="block text-sm text-gray-900 dark:text-white">
								{userInfo.username}
							</span>
							<span class="block text-sm text-gray-500 truncate dark:text-gray-400">
								{userInfo.email}
							</span>
						</div>
						<DropdownDivider />
						<DropdownItem href="/profile">Profile</DropdownItem>
						<DropdownItem href="/bookings">My Bookings</DropdownItem>
						<!-- <DropdownItem href="/settings">Settings</DropdownItem> -->
						<DropdownDivider />
						<DropdownItem on:click={handleLogout}>Sign out</DropdownItem>
					</Dropdown>
				</div>
			{:else}
				<Button href="/auth/login" size="sm">Get started</Button>
			{/if}
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
