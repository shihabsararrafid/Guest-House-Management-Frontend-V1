/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PUBLIC_API_URL } from '$env/static/public';
import type { PageLoad } from '../../../$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		console.log(params);
		// @ts-expect-error
		const response = await fetch(`${PUBLIC_API_URL}/user/${params.id}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Credentials': 'true'
			},
			// body: JSON.stringify(newRoom),
			credentials: 'include'
		});
		if (!response.ok) throw new Error('Failed to fetch user');
		const user = (await response.json())?.data;
		console.log(user);
		return {
			user
		};
	} catch (error) {
		console.error('Error loading bookings:', error);
		return {
			user: {}
		};
	}
};
