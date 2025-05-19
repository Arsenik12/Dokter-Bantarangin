import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// **GET**: Mengambil Data Obat dengan Token dari Cookies dan Query
export const GET: RequestHandler = async ({ cookies, fetch, url }) => {
	try {
		const token = cookies.get('authToken');
		if (!token) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Token tidak ditemukan, silakan login ulang.'
			}), {
				status: 401
			});
		}

		// Ambil parameter dari URL
		const q = url.searchParams.get('q') ?? '';
		const limit = url.searchParams.get('limit') ?? '10';
		const page = url.searchParams.get('page') ?? '1';

		// Susun URL akhir ke API eksternal
		const apiUrl = `${env.Obat}?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`;

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`Gagal mengambil data: ${response.statusText}`);
		}

		const data = await response.json();
		return new Response(JSON.stringify({
			success: true,
			data: data.data || []
		}), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('❌ Error saat mengambil data obat:', error);
		return new Response(JSON.stringify({
			success: false,
			error: (error as Error).message
		}), {
			status: 500
		});
	}
};
