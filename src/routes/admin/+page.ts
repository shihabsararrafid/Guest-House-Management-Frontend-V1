// routes/admin/+page.ts
import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import type { DashboardResponse } from '$lib/types/Dashboard';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/dashboard/admin`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Credentials': 'true'
			},
			// body: JSON.stringify(newRoom),
			credentials: 'include',
			method: 'GET'
		});
		if (response.ok) {
			const { stats, recentBookings } = (await response.json()).data as DashboardResponse;

			// Transform stats object into array format expected by the component
			const statsArray = Object.entries(stats).map(([key, data]) => ({
				icon: data.icon,
				label: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to Title Case
				value: key === 'revenue' ? `৳ ${data.value.toLocaleString()}` : data.value.toString(),
				trend: data.trend,
				color: data.color,
				bgColor: data.bgColor
			}));

			return {
				stats: statsArray,
				recentBookings
			};
		} else {
			const e = await response.json();
			if (response.status === 401) {
				goto('/auth/login');
			} else throw new Error(e.error.message);
		}
	} catch (error) {
		console.error(error);
	}
};
