<!-- routes/admin/+page.svelte -->
<script>
	import { TrendingUp, Users, Hotel, CreditCard, Calendar } from 'lucide-svelte';
	export let data;
	// console.log(data);
	let iconsArray = [
		{
			icon: Hotel,
			label: 'Hotel'
		},
		{
			icon: Users,
			label: 'Users'
		},
		{
			icon: Calendar,
			label: 'Calendar'
		},
		{
			icon: CreditCard,
			label: 'CreditCard'
		}
	];

	// let recentBookings = [
	//   // Sample data - replace with actual data
	// ];
</script>

<div>
	<!-- Header -->
	<header class="mb-8">
		<h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
		<p class="text-gray-600 mt-1">Welcome back, Admin</p>
	</header>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		{#if data.stats}
			{#each data.stats as stat}
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="{stat.bgColor} p-3 rounded-lg">
							{#if stat.icon}
								{@const foundIcon = iconsArray.find((i) => i.label === stat.icon)}
								{#if foundIcon}
									<svelte:component this={foundIcon.icon} class="w-6 h-6 {stat.color}" />
								{/if}
							{/if}
						</div>
						<TrendingUp class="w-5 h-5 text-green-500" />
					</div>
					<h3 class="text-gray-500 text-sm">{stat.label}</h3>
					<p class="text-2xl font-bold mt-2">{stat.value}</p>
					<p class="text-sm text-gray-600 mt-1">{stat.trend}</p>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Recent Bookings -->
	<div class="bg-white rounded-lg shadow">
		<div class="p-6 border-b">
			<h2 class="text-lg font-semibold">Recent Bookings</h2>
		</div>
		<div class="w-full overflow-x-auto">
			<div class="p-6 min-w-[800px]">
				<table class="w-full">
					<thead>
						<tr class="text-left text-sm text-gray-500">
							<th class="pb-4">Guest</th>
							<th class="pb-4">Room</th>
							<th class="pb-4">Check In</th>
							<th class="pb-4">Check Out</th>
							<th class="pb-4">Status</th>
							<th class="pb-4">Amount</th>
							<th class="pb-4">Paid</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#if data.recentBookings}
							{#each data.recentBookings as booking}
								<tr class="text-sm">
									<td class="py-4">
										<div class="flex items-center">
											<div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-3"></div>
											<div class="min-w-0">
												<p class="font-medium truncate">{booking.guestName ?? ''}</p>
												<p class="text-gray-500 truncate">{booking.email}</p>
											</div>
										</div>
									</td>
									<td class="py-4">{booking.roomNumber}</td>
									<td class="py-4">
										{new Date(booking.checkIn).toLocaleDateString()} 12:00 PM
									</td>
									<td class="py-4">
										{new Date(booking.checkOut).toLocaleDateString()} 11:00 AM
									</td>
									<td class="py-4">
										<span
											class="px-3 py-1 rounded-full text-xs inline-block
							{booking.status === 'CONFIRMED'
												? 'bg-green-100 text-green-800'
												: booking.status === 'PENDING'
													? 'bg-yellow-100 text-yellow-800'
													: booking.status === 'CANCELLED'
														? 'bg-red-100 text-red-800'
														: 'bg-gray-100 text-gray-800'}"
										>
											{booking.status}
										</span>
									</td>
									<td class="py-4">{booking.amount} BDT</td>
									<td class="py-4">{booking.paidAmount} BDT</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
