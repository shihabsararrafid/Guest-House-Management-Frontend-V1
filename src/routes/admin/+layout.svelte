<script>
	import { page } from '$app/stores';
	import {
		Home,
		Users,
		Hotel,
		Calendar,
		CreditCard,
		Settings,
		LogOut,
		Menu,
		X
	} from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let showMobileMenu = false;

	const navigationItems = [
		{ icon: Home, label: 'Dashboard', href: '/admin' },
		{ icon: Hotel, label: 'Rooms', href: '/admin/rooms' },
		{ icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
		{ icon: Users, label: 'Users', href: '/admin/users' },
		{ icon: CreditCard, label: 'Payments', href: '/admin/payments' },
		{ icon: Settings, label: 'Settings', href: '/admin/settings' }
	];

	const handleLogout = () => {
		document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		window.location.href = '/auth/login';
	};
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Mobile Menu Button -->
	<button
		class="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow"
		on:click={() => (showMobileMenu = !showMobileMenu)}
	>
		{#if showMobileMenu}
			<X class="w-6 h-6" />
		{:else}
			<Menu class="w-6 h-6" />
		{/if}
	</button>

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform
			 md:translate-x-0 transition-transform duration-200 ease-in-out
			 {showMobileMenu ? 'translate-x-0' : '-translate-x-full'}"
	>
		<div class="flex flex-col h-full">
			<div class="p-6">
				<h1 class="text-xl font-bold text-gray-800">Hotel Admin</h1>
			</div>

			<nav class="flex-1 overflow-y-auto">
				{#each navigationItems as item}
					<a
						href={item.href}
						class="flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600
				   {$page.url.pathname === item.href ? 'bg-blue-50 text-blue-600' : ''}"
						on:click={() => (showMobileMenu = false)}
					>
						<svelte:component this={item.icon} class="w-5 h-5 mr-3" />
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="p-6 border-t">
				<button
					class="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
					on:click={handleLogout}
				>
					<LogOut class="w-5 h-5 mr-2" />
					Logout
				</button>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="md:ml-64 p-4 md:p-8 pt-16 md:pt-8">
		<slot />
	</main>

	<!-- Overlay -->
	{#if showMobileMenu}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
			on:click={() => (showMobileMenu = false)}
			transition:fly={{ duration: 200 }}
		/>
	{/if}
</div>
