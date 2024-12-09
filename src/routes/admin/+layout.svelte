<!-- routes/admin/+layout.svelte -->
<script>
	import { page } from '$app/stores';
	import { Home, Users, Hotel, Calendar, CreditCard, Settings, LogOut } from 'lucide-svelte';

	const navigationItems = [
		{ icon: Home, label: 'Dashboard', href: '/admin' },
		{ icon: Hotel, label: 'Rooms', href: '/admin/rooms' },
		{ icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
		{ icon: Users, label: 'Users', href: '/admin/users' },
		{ icon: CreditCard, label: 'Payments', href: '/admin/payments' },
		{ icon: Settings, label: 'Settings', href: '/admin/settings' }
	];
	const handleLogout = () => {
		// Clear the cookie
		document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		// Redirect to home or login page
		window.location.href = '/auth/login';
	};
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
		<div class="flex flex-col h-full">
			<!-- Logo -->
			<div class="p-6">
				<h1 class="text-xl font-bold text-gray-800">Hotel Admin</h1>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 overflow-y-auto">
				{#each navigationItems as item}
					<a
						href={item.href}
						class="flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600
                     {$page.url.pathname === item.href ? 'bg-blue-50 text-blue-600' : ''}"
					>
						<svelte:component this={item.icon} class="w-5 h-5 mr-3" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Footer -->
			<div class="p-6 border-t">
				<button
					class="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
					on:click={() => {
						handleLogout();
					}}
				>
					<LogOut class="w-5 h-5 mr-2" />
					Logout
				</button>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="ml-64 p-8">
		<slot />
	</main>
</div>
