// routes/admin/+page.ts
import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import type { Room } from '$lib/types/Rooms';
import type { PageLoad } from '../$types';
export interface RoomResponse {
	message: string;
	data: Room[];
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/room/get-all-rooms`);
		// console.log(await response.json());
		if (response.ok) {
			const { data } = (await response.json()) as RoomResponse;

			return {
				rooms: data // Return an object with rooms property
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
