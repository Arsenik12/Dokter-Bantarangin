import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const PUT: RequestHandler = async ({ request, cookies, url }) => {
    const authToken = cookies.get('authToken') ?? '';
    const id_antrian = url.searchParams.get('id_antrian');

    if (!id_antrian) {
        return json({ status: 400, message: 'id_antrian is required' }, { status: 400 });
    }

    try {
        const externalApiUrl = `${env.Pulangi_Pasien}?id_antrian=${id_antrian}`;
        const response = await fetch(externalApiUrl, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_antrian: parseInt(id_antrian) })
        });

        const responseText = await response.text();
        let externalResponse;
        try {
            externalResponse = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse external API response:', responseText);
            return json({ status: 500, message: `Invalid API response: ${responseText}` }, { status: 500 });
        }

        if (response.status === 200 && externalResponse.status === 200) {
            cookies.delete('id_antrian', { path: '/' });
            return json({
                status: 200,
                message: 'Pasien berhasil dipulangkan',
                data: { id_antrian: parseInt(id_antrian) }
            });
        } else {
            return json({
                status: response.status,
                message: externalResponse.message || `Failed to discharge patient: ${responseText}`
            }, { status: response.status });
        }
    } catch (error) {
        console.error('❌ Error during discharge:', error);
        return json({ status: 500, message: 'Server error occurred' }, { status: 500 });
    }
};