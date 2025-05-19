import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

// Fungsi untuk mengambil id_antrian baru
const fetchNextPatient = async (
	fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
	authToken: string,
	idPoli: string,
	cookies: any
) => {
	const masukkanUrl = new URL(`${env.Masukan_Pasien_Ke_Dokter}?id_poli=${idPoli}`);
	console.log('📌 Memanggil Masukan_Pasien_Ke_Dokter:', masukkanUrl.toString());

	const response = await fetch(masukkanUrl.toString(), {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		const result = await response.json();
		console.log('📌 Respons Masukan_Pasien_Ke_Dokter:', result);

		if (result?.data && typeof result.data.id_antrian === 'number') {
			const id_antrian = result.data.id_antrian;
			cookies.set('id_antrian', String(id_antrian), {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24
			});
			return {
				nomor_antrian: result.data.nomor_antrian,
				id_pasien: result.data.id_pasien,
				id_antrian,
				apiError: null
			};
		} else {
			return {
				nomor_antrian: null,
				id_pasien: null,
				id_antrian: null,
				apiError: 'Struktur respons tidak sesuai atau id_antrian bukan number.'
			};
		}
	} else {
		const text = await response.text();
		console.error('❌ Gagal memanggil Masukan_Pasien_Ke_Dokter:', response.status, text);
		return {
			nomor_antrian: null,
			id_pasien: null,
			id_antrian: null,
			apiError: `Gagal masukkan pasien: ${text} (Status: ${response.status})`
		};
	}
};

// Fungsi untuk mengambil detail antrian
const fetchDetailAntrian = async (
	fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
	authToken: string,
	id_antrian: string
) => {
	const detailUrl = new URL(`${env.Detail_Antrian}?id_antrian=${id_antrian}`);
	console.log('📌 Memanggil Detail_Antrian:', detailUrl.toString());

	const detailRes = await fetch(detailUrl.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});

	if (detailRes.ok) {
		const detailData = await detailRes.json();
		console.log('📌 Respons Detail_Antrian:', detailData);
		return { detail_antrian: detailData.data || null, apiError: null };
	} else {
		const text = await detailRes.text();
		console.error('❌ Gagal memanggil Detail_Antrian:', detailRes.status, text);
		return { detail_antrian: null, apiError: `Gagal ambil detail antrian: ${text} (Status: ${detailRes.status})` };
	}
};

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const authToken = cookies.get('authToken');
	const username = cookies.get('username');
	const idPoli = cookies.get('idPoli');

	// Validasi authToken
	if (!authToken) {
		console.log('⚠️ Tidak ada authToken, redirect ke login');
		throw new Response(null, {
			status: 302,
			headers: { Location: '/' }
		});
	}

	// Validasi idPoli
	if (!idPoli || !/^\d+$/.test(idPoli)) {
		console.warn('⚠️ ID Poli tidak valid atau tidak ditemukan:', idPoli);
		return {
			username: username || 'Unknown',
			role: 'Dokter',
			id_poli: null,
			id_antrian: null,
			detail_antrian: null,
			apiError: 'ID Poli tidak valid atau tidak ditemukan dalam cookies.'
		};
	}

	let nomor_antrian = null;
	let id_pasien = null;
	let id_antrian = cookies.get('id_antrian') ?? null;
	let detail_antrian = null;
	let apiError = null;

	// Jika id_antrian kosong atau dihapus, ambil pasien baru
	if (!id_antrian || id_antrian === '') {
		const nextPatient = await fetchNextPatient(fetch, authToken, idPoli, cookies);
		nomor_antrian = nextPatient.nomor_antrian;
		id_pasien = nextPatient.id_pasien;
		id_antrian = nextPatient.id_antrian;
		apiError = nextPatient.apiError;
	} else {
		console.log('📌 id_antrian ada, memeriksa detail:', id_antrian);
	}

	// Ambil detail antrian jika id_antrian tersedia dan valid
	if (id_antrian && typeof id_antrian === 'string' && /^\d+$/.test(id_antrian)) {
		const detailResult = await fetchDetailAntrian(fetch, authToken, id_antrian);
		detail_antrian = detailResult.detail_antrian;
		if (detailResult.apiError) {
			apiError = detailResult.apiError;
		}
	} else if (!apiError) {
		console.warn('⚠️ Tidak ada id_antrian yang valid untuk fetch detail:', id_antrian);
		apiError = 'Tidak ada id_antrian yang valid untuk mengambil detail antrian.';
	}

	const result = {
		username: username || 'Guest',
		id_poli: idPoli,
		nomor_antrian,
		id_pasien,
		id_antrian,
		detail_antrian,
		apiError
	};
	console.log('📌 Data akhir yang dikembalikan:', result);
	return result;
};