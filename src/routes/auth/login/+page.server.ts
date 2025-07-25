import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
	default: async ({ cookies, request }) => {
		try {
			const data = await request.formData();
			const refererUrl = request.headers.get('referer');

			const parsedUrl = new URL(refererUrl ?? '');
			const returnUrl = parsedUrl.searchParams.get('returnUrl');
			// console.log(parsedUrl.searchParams.get('returnUrl'));

			const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
				method: 'POST',
				body: JSON.stringify(Object.fromEntries(data.entries())),
				headers: { 'Content-Type': 'application/json' }
			});
			// console.log(response);
			if (!response.ok) throw new Error('Login failed');

			const result = await response.json();
			// console.log(result, 'token');

			cookies.set('access_token', result.data.accessToken, { path: '/' });
			cookies.set('refresh_token', result.data.refreshToken, { path: '/' });
			cookies.set('user_info', JSON.stringify(result.data), {
				path: '/',
				maxAge: 3600,
				secure: true,
				sameSite: 'strict',
				httpOnly: false
			});

			const isAdmin = result?.data?.role === 'ADMIN';

			// return redirect(303, '/admin');
			return { success: true, isAdmin, returnUrl };
			// if (result?.data?.role === 'ADMIN') {
			// 	console.log('here');
			// 	throw redirect(303, '/admin/');
			// 	// console.log()
			// }
		} catch (error) {
			console.error(error, 'hrere');

			return fail(400, { success: false });
		}
		throw redirect(303, '/');
	}
};
