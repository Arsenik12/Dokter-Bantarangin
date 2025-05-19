<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Data pasien dari server API
	export let data;
	const { detail_antrian, id_antrian, apiError } = data;

	$: console.log('Data from layout:', data); // Debugging log

	let showModalResep = false;
	let showModalHome = false;
	let showModalConfirmDeleteResep = false;
	let showModalConfirmSimpanResep = false;
	let dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
	let itemList: any[] = [];
	let selectedItemId: any = null;
	let obatQuery = '';
	let obatList: any[] = [];
	let selectedObat: any = null;
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	// Ambil username dari data load
	let dokterUsername = '';
	$: dokterUsername = $page.data.username || '';

	// Error message untuk pemulangan pasien
	let errorMessage: string | null = null;

	// Debounce input manual dengan TypeScript
	function fetchObatDebounced(
		query: string,
		itemIndex: number | null = null,
		compIndex: number | null = null
	) {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = setTimeout(() => {
			fetchObat(query, itemIndex, compIndex);
		}, 300);
	}

	async function fetchObat(
		query: string,
		itemIndex: number | null = null,
		compIndex: number | null = null
	) {
		if (!query) {
			obatList = [];
			return;
		}

		try {
			const res = await fetch(
				`/main/rincian_pasien/resep?q=${encodeURIComponent(query)}&limit=30&page=1`
			);
			const json = await res.json();

			if (json.success) {
				obatList = json.data;
			} else {
				console.error('Gagal mengambil data obat:', json.message || json.error);
				obatList = [];
			}
		} catch (e) {
			console.error('❌ Error fetch obat:', e);
			obatList = [];
		}
	}

	function selectObat(obat: any, itemIndex: number | null = null, compIndex: number | null = null) {
		if (itemIndex !== null && compIndex !== null) {
			// For racikan composition
			itemList = itemList.map((item, i) => {
				if (i === itemIndex && item.type === 'racikan') {
					const updatedCompositions = item.compositions.map((comp: any, ci: number) => {
						if (ci === compIndex) {
							return { ...comp, namaObat: obat.nama };
						}
						return comp;
					});
					return { ...item, compositions: updatedCompositions };
				}
				return item;
			});
		} else if (itemIndex !== null) {
			// For resep
			itemList = itemList.map((item, i) => {
				if (i === itemIndex && item.type === 'resep') {
					return { ...item, namaObat: obat.nama };
				}
				return item;
			});
		}
		obatQuery = obat.nama;
		obatList = [];
	}

	// Fungsi untuk menambahkan komposisi baru di atas untuk racikan tertentu
	function tambahKomposisi(racikanId: number) {
		itemList = itemList.map((item) => {
			if (item.id === racikanId && item.type === 'racikan') {
				const newComposition = {
					id: Date.now(),
					namaObat: '',
					dosis: '',
					satuan: '',
					hargaSatuan: ''
				};
				const updatedCompositions = [newComposition, ...(item.compositions || [])];
				console.log('Adding composition for racikan', racikanId, 'New order:', updatedCompositions);
				return { ...item, compositions: updatedCompositions };
			}
			return item;
		});
	}

	// Fungsi untuk menghapus komposisi dari racikan tertentu
	function hapusKomposisi(racikanId: number, compIndex: number) {
		itemList = itemList.map((item) => {
			if (item.id === racikanId && item.type === 'racikan') {
				const updatedCompositions = (item.compositions || []).filter(
					(_: any, i: number) => i !== compIndex
				);
				console.log(
					'Removing composition for racikan',
					racikanId,
					'New order:',
					updatedCompositions
				);
				return { ...item, compositions: updatedCompositions };
			}
			return item;
		});
	}

	// Fungsi untuk menangani klik tombol "Tambah E-Resep"
	function handleResepClick() {
		showModalResep = true;
	}

	// Fungsi untuk menambahkan racikan
	function tambahRacikan() {
		const newRacikan = {
			type: 'racikan',
			id: Date.now(),
			compositions: [{ id: Date.now(), namaObat: '', dosis: '', satuan: '', hargaSatuan: '' }]
		};
		itemList = [...itemList, newRacikan];
	}

	// Fungsi lainnya
	function handleHomeClick() {
		errorMessage = null; // Reset error message
		showModalHome = true;
	}

	function showConfirmSimpanResep() {
		showModalConfirmSimpanResep = true;
	}

	function showConfirmDeleteResep(id: any) {
		selectedItemId = id;
		showModalConfirmDeleteResep = true;
	}

	function closeModal() {
		showModalHome = false;
		showModalResep = false;
		showModalConfirmSimpanResep = false;
		showModalConfirmDeleteResep = false;
		itemList = [];
	}

	function closeModalDeleteResep() {
		showModalConfirmDeleteResep = false;
		showModalResep = true;
	}

	function tambahResep() {
		itemList = [...itemList, { type: 'resep', id: Date.now() }];
	}

	async function hapusItem() {
		if (selectedItemId !== null) {
			itemList = itemList.filter((item) => item.id !== selectedItemId);
			selectedItemId = null;
			await tick();
		}
		showModalConfirmDeleteResep = false;
	}

	onMount(() => {
		const handleFocus = (event: KeyboardEvent) => {
			const dropdown = document.getElementById(dropdownId);
			if (dropdown && event.key === 'Tab') {
				const firstItem = dropdown.querySelector('[tabindex="0"]');
				if (firstItem) (firstItem as HTMLElement).focus();
			}
		};
		window.addEventListener('keydown', handleFocus);

		return () => window.removeEventListener('keydown', handleFocus);
	});

	const dispatch = createEventDispatcher();

	async function handleConfirm() {
		if (!id_antrian || !/^\d+$/.test(id_antrian)) {
			errorMessage = 'ID Antrian tidak valid. Silakan coba lagi.';
			return;
		}

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

		try {
			const response = await fetch(`/main/rincian_pasien?id_antrian=${id_antrian}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});

			const result = await response.json();

			if (response.ok) {
				if (result.status === 200) {
					console.log('📌 Pasien berhasil dipulangkan:', result);
					// Hapus id_antrian dari cookie di sisi klien
					document.cookie = 'id_antrian=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					closeModal();
					// Refresh halaman untuk memuat data terbaru
					setTimeout(() => {
						location.reload(); // Ganti goto dengan reload untuk memastikan state baru
					}, 500);
				} else {
					errorMessage = result.message || 'Gagal memulangkan pasien.';
				}
			} else {
				if (response.status === 401) {
					errorMessage = 'Sesi Anda mungkin tidak valid. Periksa token Anda.';
				} else {
					errorMessage = `Gagal memulangkan pasien: ${result.message || 'Unknown error'} (Status: ${response.status})`;
				}
				console.error('❌ Gagal memulangkan pasien:', response.status, result);
			}
		} catch (error) {
			console.error('❌ Error saat memanggil API pulangkan-pasien:', error);
			errorMessage = `Terjadi kesalahan: ${
				typeof error === 'object' && error !== null && 'message' in error
					? (error as { message: string }).message
					: String(error)
			}`;
		}
	}
</script>

<main class="flex h-screen flex-col overflow-hidden bg-zinc-100 px-12 pb-12 max-md:px-5">
	<!-- Main Content Area -->
	<div class="w-full overflow-hidden rounded-none bg-white pt-5 max-md:mr-2.5 max-md:max-w-full">
		<div
			class="flex h-full w-full flex-col overflow-y-auto px-6 text-base max-md:max-w-full max-md:px-5"
		>
			<!-- Patient Data Section -->
			<section aria-labelledby="patient-data-heading">
				<h2 id="patient-data-heading" class="self-start font-bold text-black">Data Pasien</h2>
				<div
					class="mt-3 flex min-h-[161px] flex-wrap content-start items-start gap-8 rounded-xl bg-slate-50 bg-opacity-90 p-4 px-4 pb-8 pt-4 text-sm shadow-[0_0_4px_rgba(0,0,0,0.25)] max-sm:p-3"
				>
					<div class="flex w-[77px] shrink grow flex-col rounded-none text-black">
						<h3 class="font-bold">Nama Pasien</h3>
						<p class="mt-1.5 self-start">{detail_antrian?.nama_pasien || ''}</p>
					</div>

					<div class="flex w-[129px] shrink grow flex-col rounded-none">
						<h3 class="font-bold text-black">Nomor Rekam Medis</h3>
						<p class="mt-1.5 self-start leading-none text-neutral-700">
							{detail_antrian?.id_rm || ''}
						</p>
					</div>

					<div class="flex w-[83px] shrink grow flex-col rounded-none">
						<h3 class="font-bold text-black">Jenis Kelamin</h3>
						<p class="mt-1.5 self-start leading-none text-neutral-700">
							{detail_antrian?.jenis_kelamin || ''}
						</p>
					</div>

					<div class="flex w-[74px] shrink grow flex-col rounded-none">
						<h3 class="font-bold text-black">Tempat lahir</h3>
						<p class="mt-1.5 self-start leading-none text-neutral-700">
							{detail_antrian?.tempat_lahir || ''}
						</p>
					</div>

					<div class="flex w-[77px] shrink grow flex-col rounded-none">
						<h3 class="font-bold text-black">Tanggal lahir</h3>
						<p class="mt-1.5 self-start leading-none text-neutral-700">
							{detail_antrian?.tanggal_lahir || ''}
						</p>
					</div>

					<div class="flex w-[117px] shrink grow flex-col rounded-none">
						<h3 class="self-start font-bold text-black">Nomor KTP/NIK</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.nik || ''}</p>
					</div>

					<div class="flex w-[77px] shrink grow flex-col rounded-none">
						<h3 class="self-start font-bold text-black">Nomor HP</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.no_telp || ''}</p>
					</div>

					<div class="flex w-[538px] min-w-60 shrink grow flex-col rounded-none">
						<h3 class="self-start font-bold text-black">Alamat Rumah</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.alamat || ''}</p>
					</div>

					<div class="flex w-[50px] shrink grow flex-col rounded-none">
						<h3 class="self-start font-bold text-black">Kota</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.kota || ''}</p>
					</div>

					<div class="w-[58px] shrink grow rounded-none">
						<h3 class="font-bold text-black">Kelurahan</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.kelurahan || ''}</p>
					</div>

					<div class="w-[65px] shrink grow rounded-none">
						<h3 class="font-bold text-black">Kecamatan</h3>
						<p class="mt-1.5 leading-none text-neutral-700">{detail_antrian?.kecamatan || ''}</p>
					</div>
				</div>
			</section>

			<!-- Assessment History Section -->
			<section aria-labelledby="assessment-history-heading">
				<h2 id="assessment-history-heading" class="mt-5 self-start font-bold text-black">
					Data Kesehatan
				</h2>
				<div
					class="mt-3 rounded-xl bg-slate-50 bg-opacity-90 p-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-sm:p-3"
				>
					<section class="mb-8 max-sm:mb-5">
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Keluhan Utama</h3>
						<div
							class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							role="textbox"
							aria-label="Keluhan Utama"
							tabindex="0"
						>
							{detail_antrian?.keluhan_utama || ''}
						</div>
					</section>

					<div class="mb-8 flex gap-8 max-md:flex-col max-md:gap-5">
						<div class="flex-1 max-md:w-full max-sm:mb-5">
							<section class="max-sm:mb-5">
								<h3 class="mb-4 text-sm font-semibold text-neutral-900">Riwayat Penyakit</h3>
								<div
									class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
									role="textbox"
									aria-label="Riwayat Penyakit"
									tabindex="0"
								>
									Riwayat Penyakit
								</div>
							</section>
						</div>
						<div class="flex-1 max-md:w-full max-sm:mb-5">
							<section class="max-sm:mb-5">
								<h3 class="mb-4 text-sm font-semibold text-neutral-900">Alergi</h3>
								<div
									class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
									role="textbox"
									aria-label="Alergi"
									tabindex="0"
								>
									Alergi
								</div>
							</section>
						</div>
						<div class="flex-1 max-md:w-full max-sm:mb-5">
							<section class="max-sm:mb-5">
								<h3 class="mb-4 text-sm font-semibold text-neutral-900">Jenis Reaksi</h3>
								<div
									class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
									role="textbox"
									aria-label="Jenis Reaksi"
									tabindex="0"
								>
									Jenis Reaksi
								</div>
							</section>
						</div>
					</div>

					<section class="mb-8 max-sm:mb-5">
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Keadaan Umum Pasien</h3>
						<div
							class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							role="textbox"
							aria-label="Keadaan Umum Pasien"
							tabindex="0"
						>
							Keadaan Umum Pasien
						</div>
					</section>

					<div class="mb-8 flex flex-wrap gap-8 max-md:gap-5 max-sm:gap-4">
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Tingkat Kesadaran</h4>
							<p class="text-sm text-black">Compos Mentis</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Kepala</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Mata</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Leher</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">THT</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Mulut</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Jantung</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Paru-paru</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Abdomen</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Genetalia</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Extremitas</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
						<div class="min-w-12 max-sm:min-w-[45%]">
							<h4 class="mb-1.5 text-sm font-bold text-black">Kulit</h4>
							<p class="text-sm text-black">Normal</p>
						</div>
					</div>

					<section class="mb-8 max-sm:mb-5">
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Diagnosis Awal Medis</h3>
						<div
							class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							role="textbox"
							aria-label="Diagnosis Awal Medis"
							tabindex="0"
						>
							Diagnosis Awal Medis
						</div>
					</section>

					<section class="mb-8 max-sm:mb-5">
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Rencana Asuhan Medis</h3>
						<div
							class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							role="textbox"
							aria-label="Rencana Asuhan Medis"
							tabindex="0"
						>
							Masukkan diagnosis utama, obat-obat dan tindakan medis yang diperlukan, dan
							pemeriksaan penunjang yang diperlukan
						</div>
					</section>

					<div class="mb-8 grid grid-cols-3 gap-2 max-md:flex-col max-md:gap-5">
						<div class="flex-1 max-md:w-full max-sm:mb-5">
							<section class="max-sm:mb-5">
								<h3 class="mb-4 text-sm font-semibold text-neutral-900">Konsultasi Selanjutnya</h3>
								<div
									class="w-[370px] rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
									role="textbox"
									aria-label="Konusltasi Selanjutnya"
									tabindex="0"
								>
									DD/MM/YYYY
								</div>
							</section>
						</div>
						<div class="flex-1 max-md:w-full max-sm:mb-5">
							<section class="max-sm:mb-5">
								<h3 class="mb-4 text-sm font-semibold text-neutral-900">Jam</h3>
								<div
									class="w-[370px] rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
									role="textbox"
									aria-label="Jam"
									tabindex="0"
								>
									00:00
								</div>
							</section>
						</div>
					</div>

					<section class="mb-8 max-sm:mb-5">
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Catatan Tambahan</h3>
						<div
							class="rounded-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							role="textbox"
							aria-label="Catatan Tambahan"
							tabindex="0"
						>
							Catatan Tambahan
						</div>
					</section>
				</div>
			</section>
		</div>
	</div>
	<!-- Action Buttons Footer -->
	<footer
		class="z-10 flex w-full flex-wrap justify-end gap-4 overflow-hidden rounded-none border-t border-solid border-t-[#E3E3E3] bg-white py-5 pl-20 pr-3 text-sm text-slate-600"
	>
		<a
			class="min-h-9 gap-2.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-[#45496A] px-3 py-2.5 font-bold text-[#45496A]"
			href="/main/tambah_assesmen"
			aria-label="Tambah Assesmen"
		>
			Tambah Assessment
		</a>

		<button
			class="min-h-9 gap-2.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-[#45496A] py-2.5 pl-3.5 pr-3.5 font-bold text-[#45496A]"
			on:click={handleResepClick}
		>
			Tambah E-Resep
		</button>

		<button
			class="flex items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-[#D31638] px-2 py-1.5 text-rose-700"
			on:click={handleHomeClick}
			disabled={!id_antrian}
		>
			<img
				src="https://cdn.builder.io/api/v1/image/assets/cdb6e732762e4e51b4748dd1606771f9/9e91e503d467f9c7674fe70b79c677f5066d9d9a12d1ca2d319fecd84beaade6?placeholderIfAbsent=true"
				class="my-auto aspect-square w-6 shrink-0 self-stretch object-contain"
				alt=""
				aria-hidden="true"
			/>
			<span class="my-auto self-stretch font-bold text-[#D31638]">Pulangkan Pasien</span>
		</button>
	</footer>
</main>

<!-- Modal Home -->
{#if showModalHome}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex max-w-[415px] flex-col items-center overflow-hidden rounded-lg bg-white px-16 pb-6 pt-2.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
			role="dialog"
			aria-labelledby="confirmationTitle"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="none">
				<path
					fill="#D31638"
					d="M55 32.083c-3.373 0-6.018 2.975-5.702 6.417l2.264 19.02A3.483 3.483 0 0 0 55 60.73a3.483 3.483 0 0 0 3.438-3.21l2.264-19.02c.32-3.438-2.329-6.417-5.702-6.417Zm0 45.834a5.73 5.73 0 1 0 0-11.459 5.73 5.73 0 0 0 0 11.459Z"
				/>
				<path
					fill="#D31638"
					d="M55 21.77a33.23 33.23 0 1 0 0 66.461 33.23 33.23 0 0 0 0-66.46ZM14.896 55a40.104 40.104 0 1 1 80.208 0 40.104 40.104 0 0 1-80.208 0Z"
				/>
			</svg>
			<h2 id="confirmationTitle" class="self-stretch text-center text-2xl text-black">
				<span class="font-bold">Apakah anda yakin ingin</span><br />
				<span class="font-bold">memulangkan pasien?</span>
			</h2>
			{#if errorMessage}
				<div class="mt-4 text-center text-sm text-red-600">
					⚠️ {errorMessage}
				</div>
			{/if}
			<div class="mt-6 flex w-full justify-center gap-4 text-sm">
				<button
					on:click={closeModal}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 font-bold text-zinc-500"
				>
					Tidak
				</button>
				<button
					on:click={handleConfirm}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-rose-700 px-1.5 font-bold text-rose-700"
					disabled={!!errorMessage}
				>
					Ya, pulangkan
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal E-Resep Obat -->
{#if showModalResep}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex h-[680px] w-[1280px] flex-col items-start justify-between overflow-hidden rounded-xl bg-white pt-3.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
		>
			<div class="flex w-full max-w-full flex-col text-slate-600 max-md:mr-2.5">
				<button
					class="mr-4 aspect-square self-end object-contain text-gray-400 hover:text-gray-600"
					on:click={closeModal}
					aria-label="Close modal"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="none">
						<path
							fill="#171717"
							d="m10.046 13.4-4.919 4.9a.954.954 0 0 1-.702.275.954.954 0 0 1-.703-.275.946.946 0 0 1-.276-.7c0-.283.092-.517.276-.7L8.64 12 3.72 7.1a.946.946 0 0 1-.275-.7c0-.283.092-.517.276-.7a.954.954 0 0 1 .703-.275c.284 0 .518.092.702.275l4.92 4.9 4.918-4.9a.954.954 0 0 1 .703-.275c.284 0 .518.092.702.275a.946.946 0 0 1 .276.7.946.946 0 0 1-.276.7L11.451 12l4.92 4.9a.946.946 0 0 1 .275.7.946.946 0 0 1-.276.7.953.953 0 0 1-.702.275.954.954 0 0 1-.703-.275l-4.919-4.9Z"
						/>
					</svg>
				</button>

				<div class="mb-4 flex w-full justify-between px-16">
					<h1 class="text-2xl font-bold">Tambah Resep Obat</h1>
					<h2 class="text-xl font-semibold">dr. {dokterUsername}</h2>
				</div>

				<div
					class="flex w-full flex-col px-16 font-semibold text-slate-600 max-md:max-w-full max-md:px-5"
				>
					<div class="h-0.5 shrink-0 border-2 border-solid border-zinc-300 max-md:max-w-full"></div>
				</div>

				<div class="mt-2 items-center gap-6 px-16 text-slate-600">
					<div class="mb-4 flex justify-between">
						<h3 class="text-2xl font-bold">{detail_antrian?.nama_pasien || ''}</h3>
						<h3 class="text-2xl font-bold">{detail_antrian?.tanggal_lahir || ''}</h3>
					</div>
					<div class="flex flex-row items-start gap-6">
						<p class="text-sm font-bold">[no. rekam medis: {detail_antrian?.id_rm || ''}]</p>
						<p class="text-sm font-bold">{detail_antrian?.jenis_kelamin || ''}</p>
						<p class="basis-auto text-sm font-bold">Umur: {detail_antrian?.umur || ''} tahun</p>
					</div>
				</div>

				<div
					class="flex w-full flex-col px-16 font-semibold text-slate-600 max-md:max-w-full max-md:px-5"
				>
					<div
						class="mt-3.5 h-0.5 shrink-0 border-2 border-solid border-zinc-300 max-md:max-w-full"
					></div>
				</div>

				<form class="flex w-full flex-col items-start px-16 max-md:max-w-full max-md:px-5">
					<div class="mt-4 h-96 w-full overflow-y-auto rounded border p-4 shadow max-md:max-w-full">
						{#each itemList as item, index}
							{#if item.type === 'resep'}
								<div class="mt-4 w-full max-md:max-w-full">
									<div class="flex gap-5 max-md:flex-col">
										<div class="flex w-[66%] flex-col max-md:ml-0 max-md:w-full">
											<div
												class="mt-2 flex grow items-start justify-between gap-5 max-md:mt-10 max-md:max-w-full"
											>
												<div class="flex flex-col items-start self-stretch">
													<label
														for={`medicineName-${index}`}
														class="text-sm font-bold text-slate-600"
													>
														Nama Obat
													</label>

													<div>
														<div
															class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
															style="position:relative;"
														>
															<input
																type="text"
																id={`medicineName-${index}`}
																bind:value={item.namaObat}
																on:input={() => fetchObatDebounced(item.namaObat, index)}
																class="flex h-[31px] w-[308px] border-none bg-transparent focus:outline-none"
																aria-label="Nama Obat"
																autocomplete="off"
																placeholder="Ketik atau pilih Nama Obat"
																on:focus={() => obatList.length > 0}
															/>
														</div>
														{#if obatList.length > 0 && item.namaObat}
															<ul
																class="absolute z-50 mt-1 max-h-40 w-[308px] overflow-y-auto rounded border border-gray-300 bg-white shadow"
															>
																{#each obatList as obat}
																	<li
																		class="cursor-pointer px-3 py-2 hover:bg-gray-100"
																		on:click={() => {
																			item.namaObat = obat.nama;
																			obatList = [];
																		}}
																	>
																		{obat.nama}
																	</li>
																{/each}
															</ul>
														{/if}
													</div>

													<label
														for={`description-${index}`}
														class="mt-10 text-sm font-bold text-slate-600 max-md:mt-10"
													>
														Instruksi Pemakaian
													</label>
												</div>
												<div class="flex flex-col text-sm text-slate-600">
													<label for={`quantity-${index}`} class="font-bold">Jumlah</label>
													<div
														class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
													>
														<input
															type="number"
															id={`quantity-${index}`}
															class="flex h-[31px] w-[81px] border-none bg-transparent focus:outline-none"
															aria-label="Jumlah"
														/>
													</div>
												</div>

												<div class="flex flex-col text-sm text-slate-600">
													<label for={`unit-${index}`} class="font-bold">Satuan</label>
													<div
														class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
													>
														<input
															type="text"
															id={`unit-${index}`}
															class="flex h-[31px] w-[81px] border-none bg-transparent focus:outline-none"
															aria-label="Satuan"
														/>
													</div>
												</div>

												<div class="flex flex-col text-sm text-slate-600">
													<label for={`unitPrice-${index}`} class="font-bold">Harga Satuan</label>
													<div
														class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
													>
														<input
															type="number"
															id={`unitPrice-${index}`}
															class="flex h-[31px] w-[90px] border-none bg-transparent focus:outline-none"
															aria-label="Harga Satuan"
														/>
													</div>
												</div>
											</div>
										</div>

										<div class="self-stretch pt-11 text-sm font-bold text-slate-600">/ tablet</div>

										<div class="ml-5 flex w-[20%] flex-col max-md:ml-0 max-md:w-full">
											<div class="flex items-start gap-10 text-sm text-slate-600 max-md:mt-9">
												<div class="mt-2 flex flex-col">
													<label for={`totalPrice-${index}`} class="font-bold">Harga Total</label>
													<div
														class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
													>
														<input
															type="number"
															id={`totalPrice-${index}`}
															readonly
															class="flex h-[31px] w-[125px] border-none bg-transparent focus:outline-none"
															aria-label="Harga Total"
														/>
													</div>
												</div>
												<button
													type="button"
													class="ml-14 self-end border-none bg-transparent"
													aria-label="Delete Resep"
													on:click={() => showConfirmDeleteResep(item.id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="34"
														height="34"
														fill="none"
													>
														<path
															fill="#D31638"
															d="M9.917 29.75c-.78 0-1.446-.277-2-.832a2.734 2.734 0 0 1-.834-2.001V8.5c-.401 0-.737-.136-1.008-.408a1.378 1.378 0 0 1-.408-1.009c-.001-.4.135-.736.408-1.008a1.373 1.373 0 0 1 1.008-.408h5.667c0-.402.136-.738.408-1.009a1.377 1.377 0 0 1 1.009-.408h5.666c.402 0 .738.136 1.01.408.272.272.408.608.407 1.009h5.667c.401 0 .738.136 1.01.408.272.272.407.608.406 1.008 0 .4-.137.737-.408 1.01a1.355 1.355 0 0 1-1.008.407v18.417c0 .779-.277 1.446-.832 2.001a2.721 2.721 0 0 1-2.002.832H9.917Zm4.25-5.667c.401 0 .738-.136 1.01-.408.272-.272.407-.608.406-1.008V12.75c0-.401-.136-.738-.408-1.009a1.378 1.378 0 0 0-1.008-.408c-.4 0-.737.135-1.009.408-.272.273-.408.61-.408 1.009v9.917c0 .401.136.738.408 1.01.272.272.608.407 1.009.406Zm5.666 0a1.37 1.37 0 0 0 1.01-.408c.272-.272.408-.608.407-1.008V12.75c0-.401-.136-.738-.408-1.009a1.378 1.378 0 0 0-1.009-.408c-.4 0-.736.135-1.008.408-.272.273-.408.61-.408 1.009v9.917c0 .401.136.738.408 1.01.272.272.608.407 1.008.406Z"
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
								<div
									class="flex min-h-[31px] w-[662px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
								>
									<textarea
										id={`description-${index}`}
										class="flex h-[31px] w-[662px] border-none bg-transparent focus:outline-none"
										aria-label="Keterangan"
									></textarea>
								</div>
								<div
									class="mt-10 h-0.5 w-full shrink-0 self-stretch border-2 border-solid border-zinc-300"
								></div>
							{/if}

							{#if item.type === 'racikan'}
								<div class="mt-4 w-full max-md:max-w-full">
									<div class="flex items-center gap-5 max-md:flex-col">
										<div class="flex flex-col items-start self-stretch">
											<label for={`namaRacikan-${index}`} class="text-sm font-bold text-slate-600">
												Nama Racikan
											</label>
											<div
												class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
											>
												<input
													id={`namaRacikan-${index}`}
													class="flex h-[31px] w-[190px] border-none bg-transparent focus:outline-none"
													aria-label="Nama Racikan"
													placeholder=""
												/>
											</div>
										</div>

										<div class="flex flex-col text-sm text-slate-600">
											<label for={`kemasan-${index}`} class="font-bold">Kemasan</label>
											<div
												class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
											>
												<input
													type="text"
													id={`kemasan-${index}`}
													class="flex h-[31px] w-[181px] border-none bg-transparent focus:outline-none"
													aria-label="Kemasan"
													placeholder=""
												/>
											</div>
										</div>

										<div class="flex flex-col text-sm text-slate-600">
											<label for={`jumlah-${index}`} class="font-bold">Jumlah</label>
											<div
												class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
											>
												<input
													type="text"
													id={`jumlah-${index}`}
													class="flex h-[31px] w-[81px] border-none bg-transparent focus:outline-none"
													aria-label="Jumlah"
													placeholder=""
												/>
											</div>
										</div>

										<div class="flex flex-col text-sm text-slate-600">
											<label for={`instruksi-${index}`} class="font-bold">Instruksi Pemakaian</label
											>
											<div
												class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
											>
												<input
													type="text"
													id={`instruksi-${index}`}
													class="flex h-[31px] w-[342px] border-none bg-transparent focus:outline-none"
													aria-label="Instruksi Pemakaian"
													placeholder=""
												/>
											</div>
										</div>

										<div class="flex flex-col text-sm text-slate-600">
											<label for={`hargaTotal-${index}`} class="font-bold">Harga Total</label>
											<div
												class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
											>
												<input
													type="number"
													id={`hargaTotal-${index}`}
													class="flex h-[31px] w-[125px] border-none bg-transparent focus:outline-none"
													aria-label="Harga Total"
													placeholder=""
												/>
											</div>
										</div>

										<button
											type="button"
											class="ml-4 self-end border-none bg-transparent"
											aria-label="Delete Racikan"
											on:click={() => showConfirmDeleteResep(item.id)}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none">
												<path
													fill="#D31638"
													d="M9.917 29.75c-.78 0-1.446-.277-2-.832a2.734 2.734 0 0 1-.834-2.001V8.5c-.401 0-.737-.136-1.008-.408a1.378 1.378 0 0 1-.408-1.009c-.001-.4.135-.736.408-1.008a1.373 1.373 0 0 1 1.008-.408h5.667c0-.402.136-.738.408-1.009a1.377 1.377 0 0 1 1.009-.408h5.666c.402 0 .738.136 1.01.408.272.272.408.608.407 1.009h5.667c.401 0 .738.136 1.01.408.272.272.407.608.406 1.008 0 .4-.137.737-.408 1.01a1.355 1.355 0 0 1-1.008.407v18.417c0 .779-.277 1.446-.832 2.001a2.721 2.721 0 0 1-2.002.832H9.917Zm4.25-5.667c.401 0 .738-.136 1.01-.408.272-.272.407-.608.406-1.008V12.75c0-.401-.136-.738-.408-1.009a1.378 1.378 0 0 0-1.008-.408c-.4 0-.737.135-1.009.408-.272.273-.408.61-.408 1.009v9.917c0 .401.136.738.408 1.01.272.272.608.407 1.009.406Zm5.666 0a1.37 1.37 0 0 0 1.01-.408c.272-.272.408-.608.407-1.008V12.75c0-.401-.136-.738-.408-1.009a1.378 1.378 0 0 0-1.009-.408c-.4 0-.736.135-1.008.408-.272.273-.408.61-.408 1.009v9.917c0 .401.136.738.408 1.01.272.272.608.407 1.008.406Z"
												/>
											</svg>
										</button>
									</div>

									<div class="mt-2 flex flex-col gap-5 max-md:flex-col">
										<!-- KOMPOSISI -->
										<h3 class="font-bold">Komposisi</h3>
										<div class="composition-list">
											<!-- Loop untuk menampilkan baris komposisi -->
											{#each item.compositions || [] as comp, compIndex (comp.id)}
												<div
													class="composition-item flex w-full items-center gap-5 max-md:flex-col"
													data-index={compIndex}
												>
													<!-- Tombol Tambah di samping baris pertama -->
													{#if compIndex === 0}
														<button
															type="button"
															class="border-none bg-transparent"
															aria-label="Tambah Komposisi Obat"
															on:click={() => tambahKomposisi(item.id)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="30"
																height="30"
																fill="none"
															>
																<path
																	fill="#171717"
																	d="M14.375 20.625h1.25v-5h5v-1.25h-5v-5h-1.25v5h-5v1.25h5zM7.02 25q-.864 0-1.441-.578-.577-.576-.579-1.442V7.02q0-.864.579-1.441T7.02 5h15.961q.863 0 1.441.579.58.579.578 1.441v15.961q0 .863-.578 1.441-.576.58-1.442.578zm0-1.25h15.961q.288 0 .529-.24.24-.24.24-.53V7.02q0-.289-.24-.53-.24-.24-.53-.24H7.02q-.289 0-.53.24-.24.24-.24.53v15.961q0 .288.24.529.24.24.529.24"
																/>
															</svg>
														</button>
													{:else}
														<button
															type="button"
															class="border-none bg-transparent"
															aria-label="Hapus Komposisi Obat"
															on:click={() => hapusKomposisi(item.id, compIndex)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="30"
																height="30"
																fill="none"
															>
																<path
																	fill="#D31638"
																	d="M8.75 15H20v1.25H8.75zM7.5 5h13.75A3.75 3.75 0 0 1 25 8.75V22.5a3.75 3.75 0 0 1-3.75 3.75H7.5a3.75 3.75 0 0 1-3.75-3.75V8.75A3.75 3.75 0 0 1 7.5 5m0 1.25A2.5 2.5 0 0 0 5 8.75V22.5A2.5 2.5 0 0 0 7.5 25h13.75a2.5 2.5 0 0 0 2.5-2.5V8.75a2.5 2.5 0 0 0-2.5-2.5z"
																/>
															</svg>
														</button>
													{/if}

													<!-- Nama Obat -->
													<div class="flex flex-col items-start self-stretch pt-1">
														<label
															for={`medicineName-${index}-${compIndex}`}
															class="text-sm font-bold text-slate-600"
														>
															Nama Obat
														</label>
														<div>
															<div
																class="flex min-h-[31px] items-center justify-center gap-2.5 self-stretch overflow-hidden border-b border-black pl-1.5 pr-1"
																style="position:relative;"
															>
																<input
																	type="text"
																	id={`medicineName-${index}-${compIndex}`}
																	bind:value={comp.namaObat}
																	on:input={() =>
																		fetchObatDebounced(comp.namaObat, index, compIndex)}
																	class="flex h-[31px] w-[308px] border-none bg-transparent focus:outline-none"
																	aria-label="Nama Obat"
																	autocomplete="off"
																	placeholder="Ketik atau pilih Nama Obat"
																	on:focus={() => obatList.length > 0}
																/>
															</div>
															{#if obatList.length > 0 && comp.namaObat}
																<ul
																	class="absolute z-50 mt-1 max-h-40 w-[308px] overflow-y-auto rounded border border-gray-300 bg-white shadow"
																>
																	{#each obatList as obat}
																		<li
																			class="cursor-pointer px-3 py-2 hover:bg-gray-100"
																			on:click={() => selectObat(obat, index, compIndex)}
																		>
																			{obat.nama}
																		</li>
																	{/each}
																</ul>
															{/if}
														</div>
													</div>

													<!-- Dosis -->
													<div class="flex flex-col items-start">
														<label
															for={`dosis-${index}-${compIndex}`}
															class="text-sm font-bold text-slate-600"
														>
															Dosis
														</label>
														<div
															class="flex min-h-[31px] items-center justify-center gap-2.5 overflow-hidden border-b border-black pl-1.5 pr-1"
														>
															<input
																type="text"
																id={`dosis-${index}-${compIndex}`}
																bind:value={comp.dosis}
																class="flex h-[31px] w-[181px] border-none bg-transparent focus:outline-none"
																aria-label="Dosis"
																placeholder=""
															/>
														</div>
													</div>

													<!-- Satuan -->
													<div class="flex flex-col items-start">
														<label
															for={`satuan-${index}-${compIndex}`}
															class="text-sm font-bold text-slate-600"
														>
															Satuan
														</label>
														<div
															class="flex min-h-[31px] items-center justify-center gap-2.5 overflow-hidden border-b border-black pl-1.5 pr-1"
														>
															<input
																type="text"
																id={`satuan-${index}-${compIndex}`}
																bind:value={comp.satuan}
																class="flex h-[31px] w-[81px] border-none bg-transparent focus:outline-none"
																aria-label="Satuan"
																placeholder=""
															/>
														</div>
													</div>

													<!-- Harga Satuan -->
													<div class="flex flex-col items-center">
														<label
															for={`hargaSatuan-${index}-${compIndex}`}
															class="text-sm font-bold text-slate-600"
														>
															Harga Satuan
														</label>
														<div
															class="flex min-h-[31px] items-center justify-center gap-2.5 overflow-hidden border-b border-black pl-1.5 pr-1"
														>
															<input
																type="number"
																id={`hargaSatuan-${index}-${compIndex}`}
																bind:value={comp.hargaSatuan}
																class="flex h-[31px] w-[90px] border-none bg-transparent focus:outline-none"
																aria-label="Harga Satuan"
																placeholder=""
															/>
														</div>
													</div>
													<div class="self-stretch pt-10 text-sm font-bold text-slate-600">
														/ tablet
													</div>
												</div>
											{/each}
										</div>
									</div>
									<div
										class="mt-10 h-0.5 w-full shrink-0 self-stretch border-2 border-solid border-zinc-300"
									></div>
								</div>
							{/if}
						{/each}
					</div>
					<div
						class="mt-6 h-0.5 w-full shrink-0 self-stretch border-2 border-solid border-zinc-300"
					></div>

					<div class="mt-3.5 flex w-full max-w-full gap-5 text-sm text-slate-600">
						<button
							class="h-[29px] w-[136px] gap-2.5 self-stretch overflow-hidden rounded-md border border-solid border-slate-600 bg-white px-3 py-2.5 text-sm text-slate-600"
							type="button"
							id="btn_tambah_assessment"
							on:click={tambahResep}
						>
							<span class="font-bold">Tambah Obat</span>
						</button>

						<button
							class="mr-52 h-[29px] w-[142px] gap-2.5 self-stretch overflow-hidden rounded-md border border-solid border-slate-600 bg-white px-3 py-2.5 text-sm text-slate-600"
							type="button"
							id="btn_tambah_assessment"
							on:click={tambahRacikan}
						>
							<span class="font-bold">Tambah Racikan</span>
						</button>

						<div class="ml-96 items-end justify-end self-end">
							<div class="flex w-[242px] max-w-full gap-10 self-end">
								<div class="items-center">
									<div class="self-end text-lg text-slate-600 max-md:mr-2.5">Total Harga</div>
									<div class="text-2xl font-bold text-slate-600">Rp. 0,00</div>
								</div>
								<button
									type="submit"
									on:click={showConfirmSimpanResep}
									class="flex h-[36px] w-[100px] flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-amber-300 px-2 py-1.5 text-amber-300"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
										<path
											fill="#F6C445"
											d="M21 7v12a1.93 1.93 0 0 1-.587 1.413A1.92 1.92 0 0 1 19 21H5c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 3 19V5c0-.55.196-1.02.588-1.412A1.93 1.93 0 0 1 5 3h12l4 4Zm-9 11c.833 0 1.542-.292 2.125-.875A2.893 2.893 0 0 0 15 15c0-.833-.292-1.542-.875-2.125A2.893 2.893 0 0 0 12 12c-.833 0-1.542.292-2.125.875A2.893 2.893 0 0 0 9 15c0 .833.292 1.542.875 2.125A2.893 2.893 0 0 0 12 18Zm-6-8h9V6H6v4Z"
										/>
									</svg>
									<span class="font-bold text-[#F6C445]">Simpan</span>
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Delete E-Resep -->
{#if showModalConfirmDeleteResep}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex max-w-[415px] flex-col items-center overflow-hidden rounded-lg bg-white px-16 pb-6 pt-2.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
			role="dialog"
			aria-labelledby="confirmationTitle"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="none">
				<path
					fill="#D31638"
					d="M55 32.083c-3.373 0-6.018 2.975-5.702 6.417l2.264 19.02A3.483 3.483 0 0 0 55 60.73a3.483 3.483 0 0 0 3.438-3.21l2.264-19.02c.32-3.438-2.329-6.417-5.702-6.417Zm0 45.834a5.73 5.73 0 1 0 0-11.459 5.73 5.73 0 0 0 0 11.459Z"
				/>
				<path
					fill="#D31638"
					d="M55 21.77a33.23 33.23 0 1 0 0 66.461 33.23 33.23 0 0 0 0-66.46ZM14.896 55a40.104 40.104 0 1 1 80.208 0 40.104 40.104 0 0 1-80.208 0Z"
				/>
			</svg>
			<h2 id="confirmationTitle" class="self-stretch text-center text-2xl text-black">
				<span class="font-bold">Apakah anda yakin ingin menghapus resep?</span>
			</h2>
			<div class="mt-6 flex w-full justify-center gap-4 text-sm">
				<button
					on:click={closeModalDeleteResep}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 font-bold text-zinc-500"
				>
					Tidak
				</button>
				<button
					on:click={hapusItem}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-rose-700 px-1.5 font-bold text-rose-700"
				>
					Ya, hapus
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Confirm Simpan E-Resep -->
{#if showModalConfirmSimpanResep}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex h-[279px] w-[447px] flex-col items-center overflow-hidden rounded-lg bg-white px-11 pb-8 pt-3.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
			role="dialog"
			aria-labelledby="dialogTitle"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="none">
				<path
					fill="#F6C445"
					d="M55 32.083c-3.373 0-6.018 2.975-5.702 6.417l2.264 19.02A3.484 3.484 0 0 0 55 60.73a3.483 3.483 0 0 0 3.437-3.21l2.265-19.02c.32-3.438-2.329-6.417-5.702-6.417Zm0 45.834a5.73 5.73 0 1 0 0-11.46 5.73 5.73 0 0 0 0 11.46Z"
				/>
				<path
					fill="#F6C445"
					d="M55 21.77a33.23 33.23 0 1 0 0 66.46 33.23 33.23 0 0 0 0-66.46ZM14.896 55a40.104 40.104 0 1 1 80.207 0 40.104 40.104 0 0 1-80.207 0Z"
				/>
			</svg>
			<h2 id="dialogTitle" class="mt-1.5 self-stretch text-center text-2xl font-bold text-black">
				Simpan resep obat?
			</h2>
			<div class="mt-7 flex w-[281px] max-w-full justify-center gap-4 text-sm">
				<button
					on:click={closeModal}
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 font-bold text-zinc-500"
				>
					Tidak
				</button>
				<button
					class="h-[34px] w-[132px] gap-1.5 self-stretch overflow-hidden rounded-md border-2 border-solid border-amber-300 px-1.5 font-bold text-amber-300"
				>
					Ya, simpan
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.bg_color {
		background-color: #9ac5e5;
	}

	.btn_ya:hover {
		background-color: #59fc3c;
		color: #f4f4f4;
	}

	.btn_tidak:hover {
		background-color: #d31638;
		color: #f4f4f4;
	}

	input:focus {
		outline: none !important;
		box-shadow: none !important;
	}

	textarea:focus {
		outline: none !important;
		box-shadow: none !important;
	}

	#btn_tambah_assessment,
	#btn_tambah_eresep {
		min-height: 36px;
		padding: 10px 14px; /* Sesuai padding pada gambar */
		font-size: 14px;
		font-weight: bold;
		border: 2px solid #45496a; /* Warna stroke sesuai dengan gambar */
		background-color: white;
		color: #45496a; /* Warna teks */
		border-radius: 6px; /* Border radius sesuai dengan gambar */
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Drop shadow */
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	#btn_tambah_assessment:hover,
	#btn_tambah_eresep:hover {
		background-color: #f4f4f4; /* Warna hover */
	}

	#btn_home {
		border: 2px solid #d32f2f; /* Warna merah untuk tombol home */
		color: #d32f2f;
	}

	/* Pastikan urutan elemen ditampilkan dari atas ke bawah */
	.composition-list {
		display: flex;
		flex-direction: column !important;
		gap: 1rem;
	}

	.composition-item {
		display: flex;
		align-items: center;
	}

	/* Pastikan tidak ada CSS eksternal yang mengganggu urutan */
	.composition-list,
	.composition-item {
		order: unset !important;
	}
</style>
