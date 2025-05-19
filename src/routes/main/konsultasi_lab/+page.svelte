<script lang="ts">
	import { writable } from 'svelte/store';

	// State
	let activeTab = 'request'; // 'request' | 'history'
	const selectedTests = writable<Set<string>>(new Set());

	function handleReset() {
		selectedTests.set(new Set());
	}

	function handleSave() {
		// Implement save functionality
	}
</script>

<main class="flex h-screen flex-col overflow-hidden bg-zinc-100 px-12 pb-12 max-md:px-5">
	<!-- Main Content Area -->
	<div class="w-full overflow-hidden rounded-none bg-white pt-5 max-md:mr-2.5 max-md:max-w-full">
		<div
			class="flex h-full w-full flex-col overflow-y-auto px-6 text-base max-md:max-w-full max-md:px-5"
		>
			<!-- Navigation Tabs -->
			<nav class="flex gap-10 text-lg font-bold text-slate-600 max-md:ml-1" role="tablist">
				<button
					role="tab"
					aria-selected={activeTab === 'request'}
					class="basis-auto text-slate-600 underline underline decoration-solid decoration-auto underline-offset-auto"
					on:click={() => (activeTab = 'request')}
				>
					Request Test
				</button>
				<button
					role="tab"
					aria-selected={activeTab === 'history'}
					class="basis-auto text-slate-600"
					on:click={() => (activeTab = 'history')}
				>
					Riwayat Hasil Test
				</button>
			</nav>

			<!-- Patient Info Card -->
			<section
				class="mt-5 flex flex-wrap content-start items-start gap-16 self-stretch rounded-xl bg-slate-50 bg-opacity-90 p-4 text-sm shadow-sm max-md:max-w-full"
				aria-label="Patient Information"
			>
				<div class="flex w-[89px] flex-col rounded-none text-black">
					<h2 class="font-bold">Nama Pasien</h2>
					<p class="mt-1.5 self-start">John Doe</p>
				</div>

				<div class="flex w-[141px] flex-col rounded-none">
					<h2 class="font-bold text-black">Nomor Rekam Medis</h2>
					<p class="mt-1.5 self-start leading-none text-neutral-700">RM2024001</p>
				</div>

				<div class="flex w-[95px] flex-col rounded-none">
					<h2 class="font-bold text-black">Jenis Kelamin</h2>
					<p class="mt-1.5 self-start leading-none text-neutral-700">Laki-laki</p>
				</div>

				<div class="flex w-[59px] flex-col rounded-none">
					<h2 class="self-start font-bold text-black">Umur</h2>
					<p class="mt-1.5 leading-none text-neutral-700">22 tahun</p>
				</div>
			</section>

			<!-- Test Checkbox Groups -->
			<section class="mt-7" aria-labelledby="test-list-title">
				<h2 id="test-list-title" class="mb-2.5 text-sm font-bold text-black">Daftar Test</h2>

				<div class="flex flex-col">
					<label class="ml-3.5 flex items-center gap-1.5 font-bold text-neutral-900">
						<input
							type="checkbox"
							class="aspect-square h-3 w-3 border-2 border-solid object-contain"
							value="hematologi"
						/>
						<span>Hematologi</span>
					</label>

					<div class="ml-8 mt-2.5 flex w-full items-start gap-3.5">
						<div class="flex w-full flex-wrap gap-3.5">
							<label class="ml-3.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>Darah Lengkap (DL)</span>
							</label>
						</div>
						<div
							class="mt-3 w-full overflow-hidden border-t border-solid border-t-[#E3E3E3] bg-white"
						></div>
					</div>

					<div class="ml-14 mt-2.5 flex w-full max-w-full flex-wrap gap-10">
						<div class="flex-1 flex-col">
							<label class="ml-3.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>Laju Endap Darah</span>
							</label>

							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>Leukosit (WBC)</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>Eritrosit (RBC)</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>Hemoglobin</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>PVC (HCT)</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>MCV</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>MCH</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="darah lengkap"
								/>
								<span>MCHC</span>
							</label>
						</div>

						<div class="flex-1 flex-col">
							<label class="ml-3.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="diffcount"
								/>
								<span>Diffcount</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="eosirofil"
								/>
								<span>Eosirofil</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="basofil"
								/>
								<span>Basofil</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="neutrofil"
								/>
								<span>Neutrofil</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="monosit"
								/>
								<span>Monosit</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="limsofit"
								/>
								<span>Limsofit</span>
							</label>
							<label class="ml-3.5 mt-2.5 flex items-center gap-1.5 text-neutral-900">
								<input
									type="checkbox"
									class="aspect-square h-3 w-3 border-2 border-solid object-contain"
									value="trombosit"
								/>
								<span>Trombosit (PLT)</span>
							</label>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- Action Buttons Footer -->
	<footer
		class="z-10 flex w-full flex-wrap justify-end gap-4 overflow-hidden rounded-none border-t border-solid border-t-[#E3E3E3] bg-white py-3 pl-20 pr-3 text-sm text-slate-600"
	>
		<button
			class="flex items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-zinc-500 px-4 py-1.5 text-zinc-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"
				><path
					fill="#888"
					d="M1.834 11A9.166 9.166 0 0 0 11 20.167 9.166 9.166 0 0 0 20.167 11 9.166 9.166 0 0 0 11 1.833v1.834a7.333 7.333 0 1 1-4.125 1.27v2.396H8.71v-5.5h-5.5v1.834H5.5A9.16 9.16 0 0 0 1.834 11"
				/></svg
			>
			<span class="my-auto self-stretch font-bold text-zinc-500">Reset</span>
		</button>
		<button
			class="flex items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-solid border-amber-300 px-2 py-1.5 text-amber-300"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
				><path
					fill="#F6C445"
					d="M21 7v12q0 .825-.587 1.413A1.92 1.92 0 0 1 19 21H5q-.824 0-1.412-.587A1.93 1.93 0 0 1 3 19V5q0-.824.588-1.412A1.93 1.93 0 0 1 5 3h12zm-9 11q1.25 0 2.125-.875A2.9 2.9 0 0 0 15 15q0-1.25-.875-2.125A2.9 2.9 0 0 0 12 12q-1.25 0-2.125.875A2.9 2.9 0 0 0 9 15q0 1.25.875 2.125A2.9 2.9 0 0 0 12 18m-6-8h9V6H6z"
				/></svg
			>
			<span class="my-auto self-stretch font-bold text-amber-300">Simpan</span>
		</button>
	</footer>
</main>
