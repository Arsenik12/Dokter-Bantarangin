<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	// Ambil data dari server (dari +layout.server.ts)
	export let data: PageData;

	// Variabel untuk mengikat input form, inisialisasi dengan data pasien jika ada
	let tensi_darah_systolic = data.detail_antrian?.tensi_darah?.split('/')[0] || '';
	let tensi_darah_diastolic = data.detail_antrian?.tensi_darah?.split('/')[1] || '';
	let berat_badan = data.detail_antrian?.berat_badan || '';
	let tinggi_badan = data.detail_antrian?.tinggi_badan || '';
	let suhu_tubuh = data.detail_antrian?.suhu_tubuh || '';
	let detak_nadi = data.detail_antrian?.detak_nadi || '';
	let resp_rate = data.detail_antrian?.resp_rate || '';
	let catatan_tambahan = data.detail_antrian?.catatan_tambahan || '';

	// State untuk modal dan error
	let showModalInputScreening = false;
	let errorMessage = '';

	// Fungsi untuk menampilkan modal
	function showInputScreening() {
		showModalInputScreening = true;
	}

	// Fungsi untuk menutup modal
	function closeModal() {
		showModalInputScreening = false;
	}

	// Fungsi untuk reset form ke nilai awal
	function Reset() {
		tensi_darah_systolic = data.detail_antrian?.tensi_darah?.split('/')[0] || '';
		tensi_darah_diastolic = data.detail_antrian?.tensi_darah?.split('/')[1] || '';
		berat_badan = data.detail_antrian?.berat_badan || '';
		tinggi_badan = data.detail_antrian?.tinggi_badan || '';
		suhu_tubuh = data.detail_antrian?.suhu_tubuh || '';
		detak_nadi = data.detail_antrian?.detak_nadi || '';
		resp_rate = data.detail_antrian?.resp_rate || '';
		catatan_tambahan = data.detail_antrian?.catatan_tambahan || '';
	}

	// Fungsi untuk submit data ke API
	async function handleSubmit() {
		// Validasi input
		if (!tensi_darah_systolic || !tensi_darah_diastolic || !berat_badan || !tinggi_badan || !suhu_tubuh || !detak_nadi || !resp_rate) {
			errorMessage = 'Semua kolom wajib diisi!';
			return;
		}

		// Ambil id_antrian dari data (dari layout server)
		const id_antrian = data.id_antrian;
		if (!id_antrian) {
			errorMessage = 'ID Antrian tidak ditemukan. Silakan coba lagi.';
			return;
		}

		// Ambil token dari cookies
		const authToken = document.cookie
			.split('; ')
			.find((row) => row.startsWith('authToken='))
			?.split('=')[1];

		if (!authToken) {
			errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
			setTimeout(() => {
				goto('/');
			}, 2000);
			return;
		}

		// Siapkan data untuk dikirim
		const requestData = {
			tensi_darah: `${tensi_darah_systolic}/${tensi_darah_diastolic}`,
			berat_badan: parseFloat(berat_badan),
			tinggi_badan: parseFloat(tinggi_badan),
			suhu_tubuh: parseFloat(suhu_tubuh),
			detak_nadi: parseInt(detak_nadi),
			resp_rate: parseInt(resp_rate),
			catatan_tambahan: catatan_tambahan || null
		};

		try {
			const response = await fetch(`/main/input_screening?id_antrian=${id_antrian}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify(requestData)
			});

			const result = await response.json();

			if (response.ok) {
				console.log('✅ Screening berhasil disimpan:', result);
				closeModal(); // Hanya tutup modal tanpa redirect
			} else {
				if (response.status === 401) {
					errorMessage = 'Sesi Anda tidak valid. Silakan login ulang.';
					setTimeout(() => {
						goto('/');
					}, 2000);
				} else {
					errorMessage = result.message || 'Gagal menyimpan screening.';
				}
				console.error('❌ Gagal menyimpan screening:', response.status, result);
			}
		} catch (error) {
			console.error('❌ Error saat menyimpan screening:', error);
			errorMessage = 'Terjadi kesalahan saat menyimpan data.';
		}
	}
</script>

<main class="flex h-screen flex-col bg-zinc-100 px-12 pb-12 max-md:px-5">
	<form
		class="flex h-full w-full flex-col overflow-hidden rounded-md bg-white pb-8 pt-5 text-sm"
		novalidate
	>
		<div class="flex flex-1 flex-col px-6 text-slate-600 overflow-auto">
			<!-- Header section with patient name and date -->
			<div class="flex w-full items-center justify-between">
				<h2 class="text-lg font-semibold text-slate-700">{data.detail_antrian?.nama_pasien || ''}</h2>
				<span class="text-xl font-semibold text-slate-500">
					{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
				</span>
			</div>

			<!-- Patient details section -->
			<div class="mt-2">
				<p class="text-slate-600 mb-1.5">No. rekam medis: <span>{data.detail_antrian?.id_rm || ''}</span></p>
				<p class="text-slate-600 mb-1.5">Jenis kelamin: <span>{data.detail_antrian?.jenis_kelamin || ''}</span></p>
				<p class="mb-4 text-slate-600">Umur: <span>{data.detail_antrian?.umur || '30'}</span> tahun</p>
			</div>

			<!-- Grid untuk Input Lain -->
			<div class="mt-8 grid grid-cols-4 gap-x-10 gap-y-6 w-full pr-72">
				<!-- Tensi Darah -->
				<div>
					<label for="TensiDarahSystolic" class="block text-sm font-bold text-[#45496A]">Tensi Darah <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="text"
							id="TensiDarahSystolic"
							class="sc_input w-[80px] flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={tensi_darah_systolic}
							required
						/>
						<span class="px-2 text-sm font-bold text-gray-500">/</span>
						<input
							type="text"
							id="TensiDarahDiastolic"
							class="sc_input w-[80px] flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={tensi_darah_diastolic}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">mmHg</span>
					</div>
				</div>

				<!-- Berat Badan -->
				<div>
					<label for="BeratBadan" class="block text-sm font-bold text-[#45496A]">Berat Badan <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="number"
							id="BeratBadan"
							class="sc_input flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={berat_badan}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">kg</span>
					</div>
				</div>

				<!-- Tinggi Badan -->
				<div>
					<label for="TinggiBadan" class="block text-sm font-bold text-[#45496A]">Tinggi Badan <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="number"
							id="TinggiBadan"
							class="sc_input flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={tinggi_badan}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">cm</span>
					</div>
				</div>

				<!-- Suhu Tubuh -->
				<div>
					<label for="SuhuTubuh" class="block text-sm font-bold text-[#45496A]">Suhu Tubuh <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="number"
							id="SuhuTubuh"
							class="sc_input flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={suhu_tubuh}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">°C</span>
					</div>
				</div>

				<!-- Detak / Nadi -->
				<div>
					<label for="DetakJantung" class="block text-sm font-bold text-[#45496A]">Detak / Nadi <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="number"
							id="DetakJantung"
							class="sc_input flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={detak_nadi}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">bpm</span>
					</div>
				</div>

				<!-- Resp. Rate -->
				<div>
					<label for="RespRate" class="block text-sm font-bold text-[#45496A]">Resp. Rate <span style="color: rgba(211,22,56,1);">*</span></label>
					<div class="flex items-center mt-4">
						<input
							type="number"
							id="RespRate"
							class="sc_input flex-1 rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
							bind:value={resp_rate}
							required
						/>
						<span class="ml-2 text-sm font-bold text-[#45496A]">menit</span>
					</div>
				</div>
			</div>

			<label for="notes" class="mt-7 font-bold">Catatan tambahan</label>
			<textarea
				id="notes"
				class="mt-3 h-full w-full rounded-md border border-solid border-neutral-400 bg-neutral-100 mb-4"
				bind:value={catatan_tambahan}
			></textarea>

			<!-- Tampilkan pesan error jika ada -->
			<!-- {#if errorMessage}
				<p class="text-red-500 mt-2">{errorMessage}</p>
			{/if} -->
		</div>

		<div class="mr-4 flex w-auto gap-3.5 justify-end items-end self-end text-sm max-md:mr-2.5 p-4 bg-white">
			<button
				type="reset"
				class="flex h-[36px] w-[100px] items-center justify-center gap-1.5 overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 py-2 text-sm text-zinc-500 shadow-sm"
				aria-label="Reset"
				on:click={Reset}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
					<path fill="#888" d="M1.833 11A9.166 9.166 0 0 0 11 20.167 9.166 9.166 0 0 0 20.167 11 9.166 9.166 0 0 0 11 1.833v1.834a7.333 7.333 0 1 1-4.125 1.27v2.396h1.833v-5.5h-5.5v1.834H5.5A9.157 9.157 0 0 0 1.833 11Z"/>
				</svg>
				<span class="font-bold text-[#888888]">Reset</span>
			</button>

			<button
				type="submit"
				class="flex h-[36px] w-[100px] flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-amber-300 px-2 py-1.5 text-amber-300"
				on:click|preventDefault={showInputScreening}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
					<path fill="#F6C445" d="M21 7v12a1.93 1.93 0 0 1-.587 1.413A1.92 1.92 0 0 1 19 21H5c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 3 19V5c0-.55.196-1.02.588-1.412A1.93 1.93 0 0 1 5 3h12l4 4Zm-9 11c.833 0 1.542-.292 2.125-.875A2.893 2.893 0 0 0 15 15c0-.833-.292-1.542-.875-2.125A2.893 2.893 0 0 0 12 12c-.833 0-1.542.292-2.125.875A2.893 2.893 0 0 0 9 15c0 .833.292 1.542.875 2.125A2.893 2.893 0 0 0 12 18Zm-6-8h9V6H6v4Z"/>
				</svg>
				<span class="font-bold text-[#F6C445]">Simpan</span>
			</button>
		</div>
	</form>
</main>

{#if showModalInputScreening}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex h-[279px] w-[447px] flex-col items-center overflow-hidden rounded-lg bg-white px-11 pb-8 pt-3.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
			role="dialog"
			aria-labelledby="dialogTitle"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="none">
				<path
					fill="#F6C445"
					d="M55 32.083c-3.373 0-6.018 2.975-5.702 6.417l2.264 19.02A3.484 3.484 0 0 0 55 60.73a3.483 3.483 0 0 0 3.437-3.21l2.265-19.02c.32-3.438-2.329-6.417-5.702-6.417Zm0 45.834a5.73 5.73 0 1 0 0-11.46 5.73 5.73 0 0 0 0 11.46Z"
				/><path
					fill="#F6C445"
					d="M55 21.77a33.23 33.23 0 1 0 0 66.46 33.23 33.23 0 0 0 0-66.46ZM14.896 55a40.104 40.104 0 1 1 80.207 0 40.104 40.104 0 0 1-80.207 0Z"
				/>
			</svg>
			<h2 id="dialogTitle" class="mt-1.5 self-stretch text-center text-2xl font-bold text-black">
				Apakah anda ingin menyimpan data input screening?
			</h2>
			<div class="mt-7 flex w-[281px] max-w-full justify-center gap-4 text-sm">
				<button
					on:click={closeModal}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 font-bold text-zinc-500"
				>
					Tidak
				</button>
				<button
					on:click|preventDefault={handleSubmit}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-amber-300 px-1.5 font-bold text-amber-300"
				>
					Ya, simpan
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.sc_input {
		border: 1px solid #a9a9a9;
	}

	input[type='date']::-webkit-calendar-picker-indicator {
		display: none;
		opacity: 0;
		position: absolute;
		-webkit-appearance: none;
		width: 10px;
		padding: 0;
		margin: 0;
		margin-top: 10px;
	}
</style>