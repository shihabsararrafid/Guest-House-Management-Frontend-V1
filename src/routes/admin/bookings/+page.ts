// routes/admin/bookings/+page.ts
import { PUBLIC_API_URL } from '$env/static/public';
import type { Booking } from '$lib/types/Booking';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/booking/get-bookings`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Credentials': 'true'
			},
			// body: JSON.stringify(newRoom),
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();

		return {
			bookings: data.data as Booking[]
		};
	} catch (error) {
		console.error('Error loading bookings:', error);
		return {
			bookings: []
		};
	}
};
