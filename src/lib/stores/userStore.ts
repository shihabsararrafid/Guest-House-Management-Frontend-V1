/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/stores/userStore.ts
import { writable } from 'svelte/store';

function createUserStore() {
	const { subscribe, set } = writable(null);

	return {
		subscribe,
		set: (userInfo: any) => {
			set(userInfo);
		},
		clear: () => set(null),
		updateFromCookie: () => {
			try {
				const cookieValue = document.cookie
					.split('; ')
					.find((row) => row.startsWith('user_info='))
					?.split('=')[1];

				if (cookieValue) {
					set(JSON.parse(decodeURIComponent(cookieValue)));
				} else {
					set(null);
				}
			} catch (error) {
				console.error('Error parsing user info from cookie:', error);
				set(null);
			}
		}
	};
}

export const userStore = createUserStore();
