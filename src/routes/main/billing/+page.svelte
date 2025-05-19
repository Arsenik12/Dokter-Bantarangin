<script lang="ts">
	import { goto } from '$app/navigation';

	let itemList: any[] = [];

	function tambahDiagnosis() {
		itemList = [...itemList, { type: 'diagnosis', id: Date.now() }];
	}

	function navigateToRincian(event: any) {
		event.preventDefault();
		goto('/main/rincian_pasien');
	}

	let showModalSimpanAssesmen = false;

	function showConfirmSimpanAssesmen() {
		showModalSimpanAssesmen = true;
	}

	function closeModal() {
		showModalSimpanAssesmen = false;
	}
</script>

<main class="flex min-h-screen flex-col bg-zinc-100 px-12 max-md:px-5">
	<div class="h-full w-full max-w-full rounded-sm border bg-white p-4 shadow max-md:max-w-full">
		<section
			class="flex h-[588px] w-full flex-col overflow-hidden overflow-y-auto rounded-md bg-white p-4 pb-7 pt-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:w-full max-md:max-w-full max-md:p-3 max-sm:p-2.5"
		>
			<header>
				<h1 class="mb-4 text-base font-bold text-neutral-900 max-sm:text-sm">BILLING ASSESMEN</h1>
				<hr class="mb-4 h-px bg-neutral-400" aria-hidden="true" />
			</header>

			{#each itemList as item, index}
				{#if item.type === 'diagnosis'}
					<form class="mt-4">
						<!-- Diagnosa Penyakit -->
						<div class="mb-8">
							<label for="diagnosa_penyakit" class="self-start font-bold text-neutral-900">
								Diagnosa Penyakit
							</label>
							<input
								id="diagnosa_penyakit"
								type="text"
								class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
								placeholder="Nama Penyakit"
							/>
						</div>

						<!-- Tindakan yang Diambil -->
						<div class="mb-8">
							<label for="tindakan_yang_diambil" class="self-start font-bold text-neutral-900">
								Tindakan yang Diambil
							</label>
							<input
								id="tindakan_yang_diambil"
								type="text"
								class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
								placeholder="Tindakan yang diambil"
							/>
						</div>

						<!-- Jumlah and Harga Tindakan row -->
						<div class="flex gap-7 max-md:flex-col max-md:gap-8">
							<div class="grow">
								<div class="mb-8">
									<label for="jumlah" class="self-start font-bold text-neutral-900"> Jumlah </label>
									<input
										id="jumlah"
										type="text"
										class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
										placeholder="Jumlah"
									/>
								</div>
							</div>
							<div>
								<div class="mb-8">
									<label for="harga_tindakan" class="self-start font-bold text-neutral-900">
										Harga Tindakan (isi angka saja)
									</label>
									<input
										id="harga_tindakan"
										type="text"
										class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
										placeholder="Rp"
									/>
								</div>
							</div>
						</div>

						<!-- Nama PIC, Tanggal Tindakan, Jam Tindakan, dan Nama Dokter -->
						<div class="grid grid-cols-4 gap-7 max-md:max-w-full">
							<!-- Nama PIC Tindakan Field -->
							<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col whitespace-nowrap">
								<label for="nama_pic_tindakan" class="self-start font-bold text-neutral-900">
									Nama PIC Tindakan
								</label>
								<input
									id="nama_pic_tindakan"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
									placeholder="Nama orang yang melakukan tindakan"
								/>
							</div>

							<!-- Tanggal Tindakan Field -->
							<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col">
								<label for="tanggal_tindakan" class="self-start font-bold text-neutral-900">
									Tanggal Tindakan
								</label>
								<input
									id="tanggal_tindakan"
									type="date"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
								/>
							</div>

							<!-- Jam Tindakan Field -->
							<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col">
								<label for="jam_tindakan" class="self-start font-bold text-neutral-900">
									Jam Tindakan
								</label>
								<input
									id="jam_tindakan"
									type="time"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
								/>
							</div>

							<!-- Nama Dokter Field -->
							<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col">
								<label for="nama_dokter" class="self-start font-bold text-neutral-900">
									Nama Dokter
								</label>
								<input
									id="nama_dokter"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
								/>
							</div>
						</div>
					</form>

					<div
						class="mt-10 h-0.5 w-full shrink-0 self-stretch border-2 border-solid border-zinc-300"
					></div>
				{/if}
			{/each}
		</section>

		<div class="mt-12 flex w-full justify-end gap-3.5 text-sm">
			<button
				type="button"
				on:click={navigateToRincian}
				class="flex h-[36px] w-[100px] items-center justify-center gap-1.5 overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-1.5 py-2 text-sm text-zinc-500 shadow-sm"
				aria-label="Kembali"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
					<path
						fill="#888"
						d="m7.173 11.917 4.492 4.491a.84.84 0 0 1 .264.642.92.92 0 0 1-.287.642.97.97 0 0 1-.642.264.84.84 0 0 1-.642-.264l-6.05-6.05a.8.8 0 0 1-.195-.298 1.07 1.07 0 0 1 .002-.687.8.8 0 0 1 .194-.299l6.05-6.05a.86.86 0 0 1 .63-.252q.379 0 .654.252a.9.9 0 0 1 .275.654.9.9 0 0 1-.275.652l-4.47 4.47h10.244q.39 0 .653.263a.88.88 0 0 1 .263.653q0 .389-.264.653a.88.88 0 0 1-.652.264z"
					/>
				</svg>
				<span class="font-bold text-[#888888]">Kembali</span>
			</button>

			<button
				type="button"
				on:click={tambahDiagnosis}
				class="flex h-[36px] w-[200px] items-center justify-center gap-1.5 overflow-hidden rounded-md border-2 border-solid border-blue-300 px-1.5 px-1.5 py-2 text-sm text-blue-300 shadow-sm"
				aria-label="Kembali"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none"
					><path
						fill="#9AC5E5"
						d="M13.334 15.167H7.5c-.33 0-.607-.112-.83-.336A1.134 1.134 0 0 1 6.333 14c0-.33.112-.607.337-.83a1.13 1.13 0 0 1 .83-.337h5.834V7c0-.33.111-.607.335-.83.224-.224.501-.336.831-.337.33 0 .607.112.832.336.225.225.336.502.335.831v5.833H21.5c.33 0 .608.112.832.336.224.224.336.501.335.831 0 .33-.113.607-.336.832-.223.225-.5.336-.83.335h-5.834V21c0 .33-.112.608-.336.832a1.127 1.127 0 0 1-.83.335 1.14 1.14 0 0 1-.832-.336 1.126 1.126 0 0 1-.335-.831v-5.833Z"
					/></svg
				>
				<span class="font-bold text-[#9AC5E5]">Tambah Diagnosa</span>
			</button>

			<button
				type="submit"
				on:click={showConfirmSimpanAssesmen}
				class="flex h-[36px] w-[100px] items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-amber-300 px-2 py-1.5 text-amber-300"
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
</main>

<!-- Modal simpan assesmen -->
{#if showModalSimpanAssesmen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div
			class="flex h-[279px] w-[447px] flex-col items-center overflow-hidden rounded-lg bg-white px-11 pb-8 pt-3.5 shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
			role="dialog"
			aria-labelledby="dialogTitle"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="none"
				><path
					fill="#F6C445"
					d="M55 32.083c-3.373 0-6.018 2.975-5.702 6.417l2.264 19.02A3.484 3.484 0 0 0 55 60.73a3.483 3.483 0 0 0 3.437-3.21l2.265-19.02c.32-3.438-2.329-6.417-5.702-6.417Zm0 45.834a5.73 5.73 0 1 0 0-11.46 5.73 5.73 0 0 0 0 11.46Z"
				/><path
					fill="#F6C445"
					d="M55 21.77a33.23 33.23 0 1 0 0 66.46 33.23 33.23 0 0 0 0-66.46ZM14.896 55a40.104 40.104 0 1 1 80.207 0 40.104 40.104 0 0 1-80.207 0Z"
				/></svg
			>
			<h2 id="dialogTitle" class="mt-1.5 self-stretch text-center text-2xl font-bold text-black">
				Simpan tagihan?
			</h2>
			<i class="mt-1.5 self-stretch text-center text-sm text-black"
				>Data tidak bisa diubah kembali</i
			>
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
