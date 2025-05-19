<script lang="ts">
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';

	// Ambil data dari server
	export let data: PageData;

	// Data dari Server
	let { riwayatScreening, riwayatKunjungan } = data;
	let activeTab = 'screening'; // State tab dikelola di client, default ke 'screening'

	// Ambil Data berdasarkan tab aktif
	$: displayedData = activeTab === 'screening' ? riwayatScreening : riwayatKunjungan;

	// State
	const selectedTests = writable<Set<string>>(new Set());

	// Fungsi untuk menampilkan modal dengan data card yang dipilih
	let showModalRiwayat = false;
	let selectedCard: any = null;

	function showRiwayat(card: any) {
		selectedCard = card;
		showModalRiwayat = true;
	}

	function closeModal() {
		showModalRiwayat = false;
		selectedCard = null;
	}

	// Fungsi untuk mengubah tab tanpa mengubah URL
	function changeTab(newTab: string) {
		activeTab = newTab;
	}
</script>

<main class="flex h-screen flex-col bg-zinc-100 px-12 pb-12 max-md:px-5">
	<div class="w-full flex-wrap gap-5 overflow-y-auto bg-white p-5 shadow">
		<!-- Navigation Tabs -->
		<nav class="mb-2 flex gap-10 text-lg font-bold text-slate-600 max-md:ml-1" role="tablist">
			<button
				role="tab"
				aria-selected={activeTab === 'screening'}
				class="basis-auto text-slate-600 {activeTab === 'screening'
					? 'underline decoration-solid underline-offset-auto'
					: ''}"
				on:click={() => changeTab('screening')}
			>
				Screening
			</button>
			<button
				role="tab"
				aria-selected={activeTab === 'kunjungan'}
				class="basis-auto text-slate-600 {activeTab === 'kunjungan'
					? 'underline decoration-solid underline-offset-auto'
					: ''}"
				on:click={() => changeTab('kunjungan')}
			>
				Kunjungan
			</button>
		</nav>

		{#if displayedData.length === 0}
			<div class="p-5 text-center text-slate-600">
				<p>
					Tidak ada riwayat {activeTab === 'screening' ? 'screening' : 'kunjungan'} yang ditemukan.
				</p>
			</div>
		{:else}
			<div class="grid h-auto w-full grid-cols-3 flex-wrap gap-5 p-5 shadow max-md:flex-col">
				{#each displayedData as card (card.id)}
					<article
						class="card h-[170px] w-[408px] rounded-2xl bg-white px-5 py-3.5 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:w-full"
					>
						<header class="mb-2 flex items-center justify-between">
							<h3 class="text-xl font-semibold text-slate-700">{card.tanggal}</h3>
							<button
								aria-label="Expand card"
								class="cursor-pointer"
								on:click={() => showRiwayat(card)}
							>
								<svg
									width="34"
									height="34"
									viewBox="0 0 34 34"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="expand-icon"
								>
									<g filter="url(#filter0_d_52790_139)">
										<rect x="4" y="4" width="26" height="26" rx="2" fill="white"></rect>
										<path
											d="M24 24H19.9167M24 24V19.9167M24 24L19.3333 19.3333M19.9167 10H24M24 10V14.0833M24 10L19.3333 14.6667M14.0833 10H10M10 10V14.0833M10 10L14.6667 14.6667M10 19.9167V24M10 24H14.0833M10 24L14.6667 19.3333"
											stroke="#45496A"
											stroke-width="1.2"
										></path>
									</g>
									<defs>
										<filter
											id="filter0_d_52790_139"
											x="0"
											y="0"
											width="34"
											height="34"
											filterUnits="userSpaceOnUse"
											color-interpolation-filters="sRGB"
										>
											<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
											<feColorMatrix
												in="SourceAlpha"
												type="matrix"
												values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
												result="hardAlpha"
											></feColorMatrix>
											<feOffset></feOffset>
											<feGaussianBlur stdDeviation="2"></feGaussianBlur>
											<feComposite in2="hardAlpha" operator="out"></feComposite>
											<feColorMatrix
												type="matrix"
												values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
											></feColorMatrix>
											<feBlend
												mode="normal"
												in2="BackgroundImageFix"
												result="effect1_dropShadow_52790_139"
											></feBlend>
											<feBlend
												mode="normal"
												in="SourceGraphic"
												in2="effect1_dropShadow_52790_139"
												result="shape"
											></feBlend>
										</filter>
									</defs>
								</svg>
							</button>
						</header>
						<div class="mt-2 grid grid-cols-[max-content_1fr] gap-y-1 text-[12px]">
							{#if activeTab === 'screening'}
								<p class="mr-2 text-[14px] font-semibold text-slate-700">Catatan Tambahan:</p>
								<p
									class="line-clamp-4 overflow-hidden text-wrap text-sm leading-relaxed text-slate-600"
								>
									{card.catatan_tambahan}
								</p>
							{:else if activeTab === 'kunjungan'}
								<p class="mr-2 text-[14px] font-semibold text-slate-700">Tujuan Poli:</p>
								<p
									class="line-clamp-4 overflow-hidden text-wrap text-sm leading-relaxed text-slate-600"
								>
									{card.tujuan_poli}
								</p>
								<p class="mr-2 text-[14px] font-semibold text-slate-700">Keluhan Utama:</p>
								<p
									class="line-clamp-4 overflow-hidden text-wrap text-sm leading-relaxed text-slate-600"
								>
									{card.keluhan_utama}
								</p>
								<p class="mr-2 text-[14px] font-semibold text-slate-700">Hasil Diagnosa:</p>
								<p
									class="line-clamp-4 overflow-hidden text-wrap text-sm leading-relaxed text-slate-600"
								>
									{card.hasil_diagnosa}
								</p>
								<p class="mr-2 text-[14px] font-semibold text-slate-700">Tindakan:</p>
								<p
									class="line-clamp-4 overflow-hidden text-wrap text-sm leading-relaxed text-slate-600"
								>
									{card.tindakan}
								</p>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</main>

{#if showModalRiwayat && selectedCard}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<section
			aria-labelledby="medical-form-title"
			class="w-[704px] rounded-md bg-white pb-6 pt-3.5 shadow-sm max-md:w-full max-md:max-w-[704px]"
		>
			<header class="ml-5 flex items-center justify-between px-6">
				<h2 id="medical-form-title" class="text-xl font-semibold text-slate-600">
					{selectedCard.tanggal}
				</h2>
				<button
					aria-label="Close medical form"
					class="rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
					on:click={closeModal}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="close-icon"
						style="cursor: pointer"
					>
						<path
							d="M14.25 3.75L3.75 14.25M3.75 3.75L14.25 14.25"
							stroke="#45496A"
							stroke-width="1.125"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
			</header>

			<div class="mb-4 w-full border-b border-solid border-b-[#888888] pb-3.5"></div>

			<div class="ml-5 p-6 px-6">
				<div class="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
					{#if activeTab === 'screening'}
						<!-- Kolom Kiri -->
						<div class="flex flex-col gap-3">
							<label for="tensiDarah" class="text-sm font-bold text-slate-600">Tensi Darah</label>
							<div class="flex items-center gap-3">
								<span
									id="tensiDarah"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.tensi_darah}
								</span>
								<span class="text-sm font-bold text-slate-600">mmHg</span>
							</div>

							<label for="tinggiBadan" class="text-sm font-bold text-slate-600">Tinggi Badan</label>
							<div class="flex items-center gap-3">
								<span
									id="tinggiBadan"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.tinggi_badan}
								</span>
								<span class="text-sm font-bold text-slate-600">cm</span>
							</div>

							<label for="detakJantung" class="text-sm font-bold text-slate-600">Detak / Nadi</label
							>
							<div class="flex items-center gap-3">
								<span
									id="detakJantung"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.detak_jantung}
								</span>
								<span class="text-sm font-bold text-slate-600">bpm</span>
							</div>
						</div>

						<!-- Kolom Kanan -->
						<div class="flex flex-col gap-3">
							<label for="beratBadan" class="text-sm font-bold text-slate-600">Berat Badan</label>
							<div class="flex items-center gap-3">
								<span
									id="beratBadan"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.berat_badan}
								</span>
								<span class="text-sm font-bold text-slate-600">kg</span>
							</div>

							<label for="suhuTubuh" class="text-sm font-bold text-slate-600">Suhu Tubuh</label>
							<div class="flex items-center gap-3">
								<span
									id="suhuTubuh"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.suhu_tubuh}
								</span>
								<span class="text-sm font-bold text-slate-600">°C</span>
							</div>

							<label for="respRate" class="text-sm font-bold text-slate-600">Resp. Rate</label>
							<div class="flex items-center gap-3">
								<span
									id="respRate"
									class="inline-block min-w-[227.95px] rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
								>
									{selectedCard.resp_rate}
								</span>
								<span class="text-sm font-bold text-slate-600">menit</span>
							</div>
						</div>
						<div class="mt-5">
							<label for="notes" class="text-sm font-bold text-slate-600">Catatan Tambahan</label>
							<div
								id="notes"
								class="h-[120px] w-[617px] overflow-y-auto rounded-md border border-solid border-neutral-400 bg-neutral-100 px-3.5 py-3 text-sm text-neutral-900 max-md:w-full max-sm:h-[150px]"
								style="white-space: pre-wrap;"
							>
								{activeTab === 'screening'
									? selectedCard.catatan_tambahan
									: selectedCard.keluhan_utama || ''}
							</div>
						</div>
					{:else if activeTab === 'kunjungan'}
						<div
							class="grid grid-cols-[140px_1fr] items-baseline gap-2.5 max-sm:grid-cols-[100%] max-sm:gap-1"
						>
							<div class="text-base font-semibold text-slate-600">Tujuan Poli</div>
							<div class="text-base text-slate-600">
								<span class="text-slate-600">: {selectedCard.tujuan_poli}</span>
							</div>
							<div class="text-base font-semibold text-slate-600">Nomor Antrian</div>
							<div class="text-base text-slate-600">
								<span class="text-slate-600">: {selectedCard.nomor_antrian}</span>
							</div>
							<div class="text-base font-semibold text-slate-600">Keluhan Utama</div>
							<div class="text-base text-slate-600">
								<span class="text-slate-600">: {selectedCard.keluhan_utama}</span>
							</div>
							<div class="text-base font-semibold text-slate-600">Hasil Diagnosa</div>
							<div class="text-base text-slate-600">
								<span class="text-slate-600">: {selectedCard.hasil_diagnosa}</span>
							</div>
							<div class="text-base font-semibold text-slate-600">Tindakan</div>
							<div class="text-base text-slate-600">
								<span class="text-slate-600">: {selectedCard.tindakan}</span>
							</div>
							<div class="text-base font-semibold text-slate-600">E-resep</div>
							<div class="text-base text-slate-600">
								<span>:</span><a href="#" class="text-slate-600 underline">
									Lihat e-resep
								</a>
							</div>
							<div class="text-base font-semibold text-slate-600">Asesmen</div>
							<div class="text-base text-slate-600">
								<span>:</span><a href="#" class="text-slate-600 underline">
									Lihat asesmen
								</a>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</section>
	</div>
{/if}

<style>
	.card {
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: scale(1.02);
	}

	.expand-icon:hover {
		filter: brightness(0.9);
	}

	.close-icon:hover {
		filter: brightness(0.9);
	}
</style>
