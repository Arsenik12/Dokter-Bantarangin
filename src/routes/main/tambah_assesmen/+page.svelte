<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToBilling(event: any) {
		event.preventDefault(); 
		goto('/main/billing');
	}

	// Current date for the header
	const currentDate = new Date().toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<main class="flex min-h-screen flex-col bg-zinc-100 px-12 max-md:px-5">
	<div
		class="h-[588px] w-full max-w-full overflow-y-auto rounded-sm border bg-white p-4 shadow max-md:max-w-full"
	>
		<div
			class="flex flex-wrap justify-between gap-5 text-base font-semibold text-slate-600 max-md:max-w-full"
		>
			<h1>Tambah Assesmen Poli Umum</h1>
			<div>{currentDate}</div>
		</div>

		<!-- ANAMNESIS SECTION -->
		<section
			class="mt-5 flex flex-col overflow-hidden rounded-md bg-white pb-7 pt-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:max-w-full"
			aria-labelledby="anamnesis-heading"
		>
			<h2
				id="anamnesis-heading"
				class="ml-4 self-start text-base font-bold text-neutral-900 max-md:ml-2.5"
			>
				ANAMNESIS
			</h2>

			<hr
				class="mt-4 h-px shrink-0 border border-solid border-neutral-400 bg-neutral-400 max-md:max-w-full"
			/>

			<div class="mt-3.5 w-full px-4 text-sm max-md:max-w-full">
				<div class="flex flex-wrap gap-7 max-md:max-w-full">
					<!-- Nama Pasien Field -->
					<div class="flex flex-1 flex-col">
						<label for="nama_pasien" class="self-start font-bold text-neutral-900">
							Nama Pasien <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<input
							id="nama_pasien"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Nama Pasien"
						/>
					</div>

					<!-- Nomor Rekam Medis Field -->
					<div class="flex flex-1 flex-col">
						<label for="nomor_rekam_medis" class="self-start font-bold text-neutral-900">
							Nomor Rekam Medis <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<input
							id="nomor_rekam_medis"
							type="text"
							class="mt-4 min-h-[35px] gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-400 shadow-sm"
							placeholder="Nama Pasien"
							required
						/>
					</div>

					<!-- Jenis Kelamin Field -->
					<div class="flex flex-1 flex-col pb-2">
						<label for="jenis_kelamin" class="self-start font-bold text-neutral-900">
							Jenis Kelamin <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<select
							id="jenis_kelamin"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							required
						>
							<option value="">-- Pilih Jenis Kelamin --</option>
							<option value="laki-laki">Laki-laki</option>
							<option value="perempuan">Perempuan</option>
						</select>
					</div>
				</div>

				<div class="mt-8 flex flex-wrap gap-7 max-md:mr-0.5 max-md:max-w-full">
					<!-- Ruang Poli Field -->
					<div class="flex flex-1 flex-col pb-2">
						<label for="ruang_poli" class="self-start font-semibold text-neutral-900">
							Ruang Poli <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<select
							id="ruang_poli"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							required
						>
							<option value="">-- Pilih Poli --</option>
							<option value="poli_umum">Poli Umum</option>
							<option value="poli_gigi">Poli Gigi</option>
							<option value="poli_anak">Poli Anak</option>
						</select>
					</div>

					<!-- Tanggal Field -->
					<div class="flex flex-1 flex-col pb-2">
						<label for="tanggal" class="self-start font-bold text-neutral-900">
							Tanggal <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<input
							id="tanggal"
							type="date"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							required
						/>
					</div>

					<!-- Jam Field -->
					<div class="flex flex-1 flex-col pb-2">
						<label for="jam" class="self-start font-bold text-neutral-900">
							Jam <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<input
							id="jam"
							type="time"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							required
						/>
					</div>
				</div>

				<div class="mt-8 flex flex-wrap gap-7 max-md:max-w-full">
					<!-- Riwayat Penyakit Field -->
					<div class="flex flex-1 flex-col">
						<label for="riwayat_penyakit" class="self-start font-bold text-neutral-900">
							Riwayat Penyakit
						</label>
						<input
							id="riwayat_penyakit"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Riwayat Penyakit"
						/>
					</div>

					<!-- Riwayat Penyakit Dahulu Field -->
					<div class="flex flex-1 flex-col">
						<label for="riwayat_penyakit_dahulu" class="self-start font-bold text-neutral-900">
							Riwayat Penyakit Dahulu
						</label>
						<input
							id="riwayat_penyakit_dahulu"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Riwayat Penyakit Dahulu"
						/>
					</div>

					<!-- Riwayat Penyakit Keluarga Field -->
					<div class="flex flex-1 flex-col">
						<label for="riwayat_penyakit_keluarga" class="self-start font-bold text-neutral-900">
							Riwayat Penyakit Keluarga
						</label>
						<input
							id="riwayat_penyakit_keluarga"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Riwayat Penyakit Keluarga"
						/>
					</div>
				</div>

				<div class="mt-8 grid grid-cols-3 gap-7 max-md:max-w-full">
					<!-- Alergi Field -->
					<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col whitespace-nowrap">
						<label for="alergi" class="self-start font-bold text-neutral-900"> Alergi </label>
						<input
							id="alergi"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Alergi"
						/>
					</div>

					<!-- Jenis Reaksi Field -->
					<div class="flex w-full flex-1 shrink-0 grow basis-0 flex-col">
						<label for="jenis_reaksi" class="self-start font-bold text-neutral-900">
							Jenis Reaksi
						</label>
						<input
							id="jenis_reaksi"
							type="text"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							placeholder="Jenis Reaksi"
						/>
					</div>
				</div>
			</div>
		</section>
		<!-- PEMERIKSAAN FISIK SECTION -->
		<section
			class="mt-5 flex flex-col overflow-hidden rounded-md bg-white py-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:max-w-full"
			aria-labelledby="physical-exam-heading"
		>
			<h2
				id="physical-exam-heading"
				class="ml-4 self-start text-base font-bold text-neutral-900 max-md:ml-2.5"
			>
				PEMERIKSAAN FISIK
			</h2>

			<hr
				class="mt-4 h-px shrink-0 border border-solid border-neutral-400 bg-neutral-400 max-md:max-w-full"
			/>

			<div
				class="mt-3.5 flex w-full flex-col items-start px-4 pb-2 text-sm font-semibold text-neutral-900 max-md:max-w-full"
			>
				<label for="keadaan_umum_pasien" class="font-bold">
					Keadaan Umum Pasien <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					type="text"
					id="keadaan_umum_pasien"
					class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-neutral-900 shadow-sm"
					placeholder="Keadaan Umum Pasien"
					required
				/>

				<label for="tingkat_kesadaran" class="mt-8 font-bold">
					Tingkat Kesadaran <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<div class="grid w-full grid-cols-3">
					<select
						id="tingkat_kesadaran"
						class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
						required
					>
						<option value="">-- Pilih Tingkat Kesadaran --</option>
						<option value="compos_mentis">Compos Mentis</option>
						<option value="somnolence">Somnolence</option>
						<option value="sopor">Sopor</option>
						<option value="coma">Coma</option>
					</select>
				</div>
			</div>

			<div class="mt-8 flex w-full flex-col items-start px-4 max-md:max-w-full">
				<div class="self-stretch max-md:max-w-full">
					<div class="grid grid-cols-3 gap-5 max-md:flex-col">
						<!-- First column - Vital Signs -->
						<div class="w-full max-md:ml-0 max-md:w-full">
							<div class="flex w-full flex-col items-start text-sm max-md:mt-7">
								<h3 class="font-bold text-neutral-900">TANDA-TANDA VITAL</h3>
								<label for="tekanan_darah" class="mt-5 font-bold text-neutral-900">
									Tekanan Darah <span style="color: rgba(211,22,56,1);">*</span>
								</label>
								<input
									id="tekanan_darah"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
									placeholder="e.g: 120/80 mmHg"
									required
								/>
							</div>
						</div>

						<!-- Second column -->
						<div class="w-full max-md:ml-0 max-md:w-full">
							<div class="mt-9 flex w-full flex-col text-sm max-md:mt-10">
								<label for="nadi" class="self-start font-bold text-neutral-900">
									Nadi <span style="color: rgba(211,22,56,1);">*</span>
								</label>
								<input
									id="nadi"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
									placeholder="e.g: 80 per menit"
									required
								/>
							</div>
						</div>

						<!-- Third column -->
						<div class="w-full max-md:ml-0 max-md:w-full">
							<div class="mt-9 flex w-full flex-col text-sm max-md:mt-10">
								<label for="respirasi" class="self-start font-bold text-neutral-900">
									Respirasi <span style="color: rgba(211,22,56,1);">*</span>
								</label>
								<input
									id="respirasi"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
									placeholder="e.g: 12 per menit"
									required
								/>
							</div>
						</div>
					</div>
				</div>
				<div class="self-stretch max-md:max-w-full">
					<div class="grid grid-cols-3 gap-5 max-md:flex-col">
						<!-- First column - Vital Signs -->
						<div class="w-full max-md:ml-0 max-md:w-full">
							<div class="flex w-full flex-col items-start text-sm max-md:mt-7">
								<label for="tekanan_darah" class="mt-5 font-bold text-neutral-900">
									Suhu Badan <span style="color: rgba(211,22,56,1);">*</span>
								</label>
								<input
									id="tekanan_darah"
									type="text"
									class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
									placeholder="e.g: 36,5°C"
									required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<hr
				class="mt-8 h-px shrink-0 border border-solid border-neutral-200 bg-neutral-200 max-md:max-w-full"
			/>

			<!-- Status Generalis Section -->
			<div class="mt-3.5 flex w-full flex-col px-4 max-md:max-w-full">
				<h3 class="self-start text-sm font-bold text-neutral-900">STATUS GENERALIS</h3>
				<div class="mt-5 grid grid-cols-5 gap-6 max-md:max-w-full">

					<div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Kepala <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Mata <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Leher <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							THT <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Mulut <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Jantung <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Paru-paru <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Abdomen <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Genetalia <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Extremitas <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>

                    <div class="text-sm font-semibold text-neutral-900">
						<label for="" class="self-start font-bold">
							Kulit <span style="color: rgba(211,22,56,1);">*</span>
						</label>
						<div
							class="mt-1.5 flex min-h-5 items-center gap-8 rounded-md py-1 text-xs text-neutral-900"
						>
							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="normal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Normal
							</label>

							<label class="relative flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="kepala"
									value="abnormal"
									class="h-[10px] w-[10px] scale-100 transform leading-none accent-black"
								/>
								Abnormal
							</label>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- HASIL PEMERIKSAAN PENUNJANG SECTION -->
		<section
			class="mt-5 flex flex-col overflow-hidden rounded-md bg-white py-4 font-semibold shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:max-w-full"
			aria-labelledby="supporting-exam-heading"
		>
			<h2
				id="supporting-exam-heading"
				class="ml-4 self-start text-base font-bold text-neutral-900 max-md:ml-2.5"
			>
				HASIL PEMERIKSAAN PENUNJANG
			</h2>

			<hr
				class="mt-4 h-px shrink-0 border border-solid border-neutral-400 bg-neutral-400 max-md:max-w-full"
			/>

			<div
				class="mt-3.5 flex w-full flex-col items-start px-4 text-sm text-neutral-900 max-md:max-w-full"
			>
				<label for="" class="font-bold">
					Asal Hasil Pemeriksaan Penunjang <span style="color: rgba(211,22,56,1);">*</span>
				</label>

				<div
					class="mt-1.5 flex w-[564px] max-w-full flex-wrap justify-between gap-5 text-xs text-neutral-900"
				>
					<div
						class="flex min-h-5 items-center gap-1.5 whitespace-nowrap rounded-md py-1"
					>
						<input
							type="checkbox"
							name="pemeriksaan_lab"
							id="pemeriksaan_lab"
							class="h-[10px] w-[10px]"
						/>
						<label for="pemeriksaan_lab" class="my-auto self-stretch"> Laboratorium </label>
					</div>

					<div
						class="flex min-h-5 items-center gap-1.5 whitespace-nowrap rounded-md py-1"
					>
						<input
							type="checkbox"
							name="pemeriksaan_lab"
							id="pemeriksaan_lab"
							class="h-[10px] w-[10px]"
						/>
						<label for="pemeriksaan_lab" class="my-auto self-stretch"> Radiologi </label>
					</div>

					<div
						class="flex min-h-5 items-center gap-1.5 whitespace-nowrap rounded-md py-1"
					>
						<input
							type="checkbox"
							name="pemeriksaan_lab"
							id="pemeriksaan_lab"
							class="h-[10px] w-[10px]"
						/>
						<label for="pemeriksaan_lab" class="my-auto self-stretch"> EKG </label>
					</div>

					<div
						class="flex min-h-5 items-center gap-1.5 whitespace-nowrap rounded-md py-1"
					>
						<input
							type="checkbox"
							name="pemeriksaan_lab"
							id="pemeriksaan_lab"
							class="h-[10px] w-[10px]"
						/>
						<label for="pemeriksaan_lab" class="my-auto self-stretch"> Penunjang Lain</label>
					</div>
				</div>

				<label for="penunjang_lain" class="mt-8 font-bold">
					Penunjang Lain <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					id="penunjang_lain"
					type="text"
					class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-neutral-900 shadow-sm"
					placeholder="Penunjang Lain"
				/>
			</div>
		</section>

		<!-- DIAGNOSIS MEDIS SECTION -->
		<section
			class="mt-5 flex flex-col overflow-hidden rounded-md bg-white py-4 font-semibold shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:max-w-full"
			aria-labelledby="diagnosis-heading"
		>
			<h2
				id="diagnosis-heading"
				class="ml-4 self-start text-base font-bold text-neutral-900 max-md:ml-2.5"
			>
				DIAGNOSIS MEDIS
			</h2>

			<hr
				class="mt-4 h-px shrink-0 border border-solid border-neutral-400 bg-neutral-400 max-md:max-w-full"
			/>

			<div class="mt-3.5 flex w-full flex-col px-4 text-sm text-neutral-900 max-md:max-w-full">
				<label for="diagnosis_awal_medis" class="self-start font-bold">
					Diagnosis Awal Medis <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					id="diagnosis_awal_medis"
					type="text"
					class="mt-4 min-h-[70px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 pb-11 pt-2.5 text-neutral-900 shadow-sm"
					placeholder="Diagnosis Awal Medis"
					required
				/>

				<label for="masalah_medis" class="mt-8 self-start font-bold">
					Masalah Medis <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					id="masalah_medis"
					type="text"
					class="mt-4 min-h-[70px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 pb-11 pt-2.5 text-neutral-900 shadow-sm"
					placeholder="Masalah Medis"
					required
				/>
			</div>
		</section>

		<!-- RENCANA ASUHAN MEDIS SECTION -->
		<section
			class="mt-5 flex flex-col overflow-hidden rounded-md bg-white py-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] max-md:mr-2 max-md:max-w-full"
			aria-labelledby="care-plan-heading"
		>
			<h2
				id="care-plan-heading"
				class="ml-4 self-start text-base font-bold text-neutral-900 max-md:ml-2.5"
			>
				RENCANA ASUHAN MEDIS
			</h2>

			<hr
				class="mt-4 h-px shrink-0 border border-solid border-neutral-400 bg-neutral-400 max-md:max-w-full"
			/>

			<div
				class="mt-3.5 flex w-full flex-col items-start px-4 text-sm text-neutral-400 max-md:max-w-full"
			>
				<label for="rencana_asuhan_medis" class="font-bold text-neutral-900">
					Rencana Asuhan Medis <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					id="rencana_asuhan_medis"
					type="text"
					class="mt-4 min-h-[70px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 pb-11 pt-2.5 shadow-sm max-md:max-w-full"
					placeholder="Masukkan diagnosis utama, obat-obat dan tindakan medis yang diperlukan, dan pemeriksaan penunjang yang diperlukan"
				/>

				<div class="mt-4 grid w-full max-w-full grid-cols-3 gap-7 whitespace-nowrap text-start">
					<div class="relative flex w-full flex-1 shrink-0 grow basis-0 flex-col pb-2">
						<label for="tanggal" class="self-start font-bold text-neutral-900"
							>Konsultasi Selanjutnya
						</label>
						<input
							type="date"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 shadow-sm"
						/>
					</div>

					<div class="relative flex w-full flex-1 shrink-0 grow basis-0 flex-col pb-2">
						<label for="jam" class="self-start font-bold text-neutral-900"> Jam </label>
						<input
							id="jam"
							type="time"
							class="mt-4 min-h-[35px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 py-2.5 text-start text-neutral-900 shadow-sm"
							required
						/>
					</div>
				</div>

				<p class="mt-2 text-xs">Konsultasi selanjutnya tidak perlu diisi jika tidak diperlukan</p>

				<label for="catatan_tambahan" class="mt-8 font-bold text-neutral-900">
					Catatan Tambahan <span style="color: rgba(211,22,56,1);">*</span>
				</label>
				<input
					id="catatan_tambahan"
					type="text"
					class="mt-4 min-h-[70px] w-full gap-2.5 self-stretch overflow-hidden rounded-md border-none bg-neutral-100 px-4 pb-11 pt-2.5 text-neutral-900 shadow-sm"
					placeholder="Catatan Tambahan"
				/>
			</div>
		</section>

		<!-- SAVE BUTTON -->
        
		<button
			type="button"
            on:click={navigateToBilling}
			class="mt-5 min-h-10 w-full gap-5 self-stretch overflow-hidden rounded-md border-2 border-solid border-[#9AC5E5] px-1.5 py-3 text-center text-base font-semibold text-blue-300 max-md:mr-2"
			aria-label="Simpan assesmen"
            
		>
			SIMPAN ASSESMEN
		</button>
	</div>
</main>
