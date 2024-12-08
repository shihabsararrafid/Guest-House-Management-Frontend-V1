import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
	default: async ({ cookies, request }) => {
		try {
			const data = await request.formData();

			const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
				method: 'POST',
				body: JSON.stringify(Object.fromEntries(data.entries())),
				headers: { 'Content-Type': 'application/json' }
			});
			console.log(response);
			if (!response.ok) throw new Error('Login failed');

			const result = await response.json();
			console.log(result, 'token');

			cookies.set('access_token', result.data.accessToken, { path: '/' });
			cookies.set('refresh_token', result.data.refreshToken, { path: '/' });
		} catch (error) {
			console.error(error);

			return fail(400, { success: false });
		}
		throw redirect(303, '/');
	}
};
