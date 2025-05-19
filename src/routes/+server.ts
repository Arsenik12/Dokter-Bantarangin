import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// **GET**: Cek apakah user masih login atau ambil daftar poliklinik
export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	if (url.searchParams.get('poli') === 'true') {
		console.log('📌 Request GET daftar poliklinik');
		try {
			const response = await fetch(env.Dropdown_Poli, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				throw new Error('Gagal mengambil data poliklinik.');
			}

			const data = await response.json();
			return new Response(JSON.stringify({ success: true, data: data.data }), {
				status: 200
			});
		} catch (error) {
			return new Response(JSON.stringify({ success: false, message: (error as Error).message }), {
				status: 500
			});
		}
	}

	// Cek apakah ada token login di cookies
	const authToken = cookies.get('authToken');

	if (!authToken) {
		throw redirect(302, '/');
	}

	return new Response(JSON.stringify({ user: authToken }), {
		headers: { 'Content-Type': 'application/json' },
		status: 200
	});
};

// **POST**: Login dokter dan validasi id_poli
export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const { username, password, id_poli } = await request.json();

		if (!id_poli) {
			throw new Error('Anda harus memilih poli yang sesuai.');
		}

		const response = await fetch(env.Login_Dokter, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password, id_poli })
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.message || 'Login gagal.');
		}

		const data = await response.json();
		const token = data.data?.token;
		const user = data.data.username;
		const poli = data.data.id_poli;

		if (!token) {
			throw new Error('Token tidak ditemukan dalam response API.');
		}

		// Simpan token di cookies selama 1 hari
		cookies.set('authToken', token, {
			httpOnly: false,
			secure: false,
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		// Simpan username di cookies selama 1 hari
		cookies.set('username', user, {
			httpOnly: false,
			secure: false,
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		// Simpan id_poli di cookies selama 1 hari
		cookies.set('idPoli', poli, {
			httpOnly: false,
			secure: false,
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		return new Response(JSON.stringify({ success: true, message: 'Login berhasil' }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ success: false, message: (error as Error).message }), {
			status: 401
		});
	}
};

// **DELETE**: Logout (hapus token, username, dan idPoli dari cookies)
export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('authToken', { path: '/' });
	cookies.delete('username', { path: '/' });
	cookies.delete('idPoli', { path: '/' });

	return new Response(JSON.stringify({ success: true, message: 'Logout berhasil' }), { status: 200 });
};