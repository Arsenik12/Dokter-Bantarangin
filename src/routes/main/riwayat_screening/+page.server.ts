import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const authToken = cookies.get('authToken');
	// Prioritaskan id_antrian dari URL, fallback ke cookie jika tidak ada
	const idAntrianFromUrl = url.searchParams.get('id_antrian');
	const idPasienFromCookie = cookies.get('id_antrian');
	const idPasien = idAntrianFromUrl || idPasienFromCookie;

	if (!authToken) {
		throw error(401, 'Unauthorized: Token not found');
	}

	if (!idPasien) {
		throw error(400, 'id_pasien is required');
	}

	const idPasienNumber = parseInt(idPasien, 10);
	if (isNaN(idPasienNumber)) {
		throw error(400, 'id_pasien must be a valid number');
	}

	try {
		// Ambil data untuk kedua tab
		const [screeningResponse, kunjunganResponse] = await Promise.all([
			fetch(`${env.Screening_Pasien}?id_pasien=${idPasienNumber}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authToken}`,
					'Content-Type': 'application/json'
				}
			}),
			fetch(`${env.Riwayat_Kunjungan}?id_pasien=${idPasienNumber}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authToken}`,
					'Content-Type': 'application/json'
				}
			})
		]);

		if (!screeningResponse.ok) {
			const text = await screeningResponse.text();
			console.error('❌ Gagal mengambil riwayat screening:', screeningResponse.status, text);
			throw error(screeningResponse.status, `Gagal mengambil riwayat screening: ${text}`);
		}

		if (!kunjunganResponse.ok) {
			const text = await kunjunganResponse.text();
			console.error('❌ Gagal mengambil riwayat kunjungan:', kunjunganResponse.status, text);
			throw error(kunjunganResponse.status, `Gagal mengambil riwayat kunjungan: ${text}`);
		}

		const screeningResult = await screeningResponse.json();
		const kunjunganResult = await kunjunganResponse.json();

		const riwayatScreening = !screeningResult.data || screeningResult.data.length === 0
			? []
			: screeningResult.data.map((item: any) => ({
				id: item.id_screening,
				tensi_darah: `${item.systolic}/${item.diastolic}`,
				berat_badan: item.berat_badan,
				tinggi_badan: item.tinggi_badan,
				suhu_tubuh: item.suhu_tubuh,
				detak_jantung: item.detak_nadi,
				resp_rate: item.laju_respirasi,
				tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}),
				catatan_tambahan: item.keterangan
			}));

		const riwayatKunjungan = !kunjunganResult.data || kunjunganResult.data.length === 0
			? []
			: kunjunganResult.data.map((item: any) => ({
				id: item.id_kunjungan || item.id,
				tanggal: item.tanggal || 'Tidak ada data',
				tujuan_poli: item.tujuan_poli || 'Tidak ada data',
				nomor_antrian: item.nomor_antrian || 'Tidak ada data',
				keluhan_utama: item.keluhan_utama || 'Tidak ada data',
				hasil_diagnosa: item.hasil_diagnosa || 'Tidak ada data',
				tindakan: item.tindakan || 'Tidak ada data'
			}));

		console.log('Data riwayat screening:', riwayatScreening);
		console.log('Data riwayat kunjungan:', riwayatKunjungan);

		return {
			riwayatScreening,
			riwayatKunjungan
		};
	} catch (err) {
		console.error('🚨 Error di page.server.ts:', err);
		let errorMessage = 'Unknown error';
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		throw error(500, `Internal Server Error: ${errorMessage}`);
	}
};