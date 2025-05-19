<script lang="ts">
	// Types for the InfoRow component
	interface InfoRowProps {
		label: string;
		value: string;
		isLink?: boolean;
		href?: string;
	}

	// Default props for the AppointmentCard
	let date: string = '8 Januari 2025';
	let clinic: string = 'Poli Umum';
	let queueNumber: string = '023';
	let mainComplaint: string =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacus quam, viverra eget lorem nec, facilisis sollicitudin nunc.';
	let diagnosis: string = 'Diambil dari ICD10';
	let treatment: string = 'Diambil dari ICD9';
	let ePrescriptionUrl: string = '#';
	let assessmentUrl: string = '#';

	// InfoRow data
	const infoRows: InfoRowProps[] = [
		{ label: 'Tujuan Poli', value: clinic },
		{ label: 'Nomor Antrian', value: queueNumber },
		{ label: 'Keluhan Utama', value: mainComplaint },
		{ label: 'Hasil Diagnosa', value: diagnosis },
		{ label: 'Tindakan', value: treatment },
		{ label: 'E-resep', value: 'Lihat e-resep', isLink: true, href: ePrescriptionUrl },
		{ label: 'Asesmen', value: 'Lihat asesmen', isLink: true, href: assessmentUrl }
	];

	function handleClose() {
		// Handle close event
		console.log('Appointment card closed');
	}
</script>

<main class="flex justify-center p-4">
	<section
		class="relative w-[620px] rounded-md bg-white px-6 py-3.5 shadow-[0_0_4px_rgba(0,0,0,0.5)] max-md:w-full max-md:max-w-[620px] max-sm:px-4 max-sm:py-3"
		aria-labelledby="appointment-date"
	>
		<h2 id="appointment-date" class="mb-3 text-xl font-semibold text-slate-600">{date}</h2>

		<!-- Close Button -->
		<button
			on:click={handleClose}
			class="absolute right-[15px] top-[15px] cursor-pointer"
			aria-label="Close"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="close"
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

		<div
			class="mb-5 ml-0 mr-0 mt-2.5 h-px bg-zinc-500 max-sm:-mx-4 max-sm:mb-5 max-sm:mt-2.5"
			role="separator"
		></div>

		<div class="grid gap-3">
			{#each infoRows as row}
				<div
					class="grid grid-cols-[140px_1fr] items-baseline gap-2.5 max-sm:grid-cols-[100%] max-sm:gap-1"
				>
				<div class="text-base font-semibold text-slate-600">Tujuan Poli</div>
				<div class="text-base text-slate-600">
						<span>:</span><a href={row.href} class="text-slate-600 underline">
							{row.value}
						</a>
					
				</div>
				<!-- <div class="text-base font-semibold text-slate-600">{row.label}</div>
				<div class="text-base text-slate-600">
					{#if row.isLink}
						<span>:</span><a href={row.href} class="text-slate-600 underline">
							{row.value}
						</a>
					{:else}
						: {row.value}
					{/if}
				</div> -->
			</div>
			{/each}
		</div>
	</section>
</main>
