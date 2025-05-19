import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private'; 
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url, cookies, fetch }) => {
    try {
        // Ambil token dari cookies
        const authToken = cookies.get('authToken');

        if (!authToken) {
            return json({ message: "Unauthorized: Token not found" }, { status: 401 });
        }

        // Ambil id_antrian dari query parameter
        const idAntrian = url.searchParams.get('id_antrian');
        if (!idAntrian) {
            return json({ message: "Bad Request: ID Antrian is required" }, { status: 400 });
        }

        // Ambil data dari body request
        const requestData = await request.json();

        // Validasi data
        if (!requestData.tensi_darah || !requestData.berat_badan || !requestData.tinggi_badan || !requestData.suhu_tubuh || !requestData.detak_nadi || !requestData.resp_rate) {
            return json({ message: "Bad Request: Semua kolom wajib diisi" }, { status: 400 });
        }

        // Buat URL lengkap untuk API backend
        const apiUrl = `${env.Input_Screening}?id_antrian=${idAntrian}`;

        console.log("📤 Mengirim data ke backend:", apiUrl, requestData);

        // Kirim data ke backend
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("❌ Gagal menginput screening:", result);
            return json({ message: result.message || "Gagal menyimpan screening", status: response.status }, { status: response.status });
        }

        console.log("✅ Screening berhasil disimpan:", result);

        return json({ status: 200, message: "Screening berhasil disimpan", data: result }, { status: 200 });

    } catch (error) {
        console.error("🚨 Terjadi kesalahan di server.ts:", error);
        return json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
};