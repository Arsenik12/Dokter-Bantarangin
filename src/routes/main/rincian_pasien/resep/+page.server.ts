import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Misal cookie bernama 'auth_token' berisi JSON: { username: "dr.budi" }
	const auth = cookies.get('auth_token');
	let username = '';
	if (auth) {
		try {
			const parsed = JSON.parse(auth);
			username = parsed.username || '';
		} catch {
			username = '';
		}
	}
	return { username };
};
