<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	export let children;
	export let data: {
		username: string;
		role: string;
		id_poli: string;
		id_antrian: number | null;
		nomor_antrian: number | null;
		id_pasien: number | null;
		detail_antrian: {
			alamat: string;
			id_antrian: number;
			id_pasien: number;
			id_rm: string;
			jenis_kelamin: string;
			kecamatan: string;
			keluhan_utama: string;
			kelurahan: string;
			kota: string;
			nama_pasien: string;
			nik: string;
			no_telp: number;
			nomor_antrian: number;
			tanggal_lahir: string;
			tempat_lahir: string;
			umur: number;
		} | null;
		apiError: string | null;
	};

	console.log('Layout data:', data);

	const pageTitles: Record<string, string> = {
		'/main/rincian_pasien': 'Rincian',
		'/main/tambah_assesmen': 'Rincian',
		'/main/billing': 'Rincian',
		'/main/riwayat_screening': 'Riwayat Screening',
		'/main/input_screening': 'Input Screening',
		'/main/konsultasi_lab': 'Konsultasi Lab'
	};

	async function logout() {
		try {
			const response = await fetch('/', {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.ok) {
				console.log('✅ Logout berhasil');
				goto('/');
			} else {
				console.error('❌ Logout gagal:', await response.text());
			}
		} catch (error) {
			console.error('❌ Terjadi kesalahan saat logout:', error);
		}
	}

	let interval: any;

	onMount(() => {
		interval = setInterval(() => {
			const authToken = document.cookie.split('; ').find((row) => row.startsWith('authToken='));
			if (!authToken && $page.url.pathname !== '/') {
				console.log('❌ authToken hilang, redirect ke login...');
				goto('/');
			}
		}, 3000);

		return () => clearInterval(interval);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	const activeButtonStore = derived(page, ($page) => {
		return pageTitles[$page.url.pathname] || 'Rincian Pasien';
	});

	let activeButton = '';
	activeButtonStore.subscribe((value) => {
		activeButton = value;
	});

	function navigateTo(route: string) {
		goto(route);
	}
</script>

<main aria-label="Patient Dashboard">
	<div class="flex h-full w-full flex-col overflow-hidden bg-zinc-100 px-12 pt-10 max-md:px-5">
		<header class="flex w-full flex-wrap justify-between gap-5 max-md:max-w-full">
			<div class="flex flex-col max-md:max-w-full">
				<div class="flex items-center gap-5 self-start">
					<h1 class="my-auto grow self-stretch text-2xl text-slate-600">
						<span class="font-bold text-slate-600">Welcome in, dr. {data.username}</span>
					</h1>
					<div
						class="h-[60px] w-px shrink-0 self-stretch border border-solid border-black"
						role="separator"
					></div>
					<button
						class="my-auto flex h-9 w-9 items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-md border border-solid border-slate-600 bg-white px-1.5"
						aria-label="Logout"
						on:click={logout}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
							<path
								fill="#45496A"
								d="M5 21c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 3 19V5c0-.55.196-1.02.588-1.412A1.93 1.93 0 0 1 5 3h6c.283 0 .521.096.713.288.192.192.288.43.287.712 0 .283-.097.52-.288.713A.957.957 0 0 1 11 5H5v14h6c.283 0 .521.096.713.288.192.192.288.43.287.712 0 .283-.097.52-.288.713A.957.957 0 0 1 11 21H5Zm12.175-8H10a.965.965 0 0 1-.712-.288A.972.972 0 0 1 9 12c0-.283.095-.52.288-.712A.97.97 0 0 1 10 11h7.175L15.3 9.125a.918.918 0 0 1-.275-.675c0-.267.092-.5.275-.7a.95.95 0 0 1 .7-.313.943.943 0 0 1 .725.288L20.3 11.3c.2.2.3.433.3.7 0 .267-.1.5-.3.7l-3.575 3.575c-.2.2-.437.296-.712.288a1.019 1.019 0 0 1-.713-.313.97.97 0 0 1-.262-.712.984.984 0 0 1 .287-.688l1.85-1.85Z"
							/>
						</svg>
					</button>
				</div>
				<nav
					class="mt-6 flex w-full flex-wrap text-xl text-slate-600 max-md:max-w-full"
					aria-label="Patient Information Tabs"
				>
					<button
						class={`flex items-center justify-center gap-5 overflow-hidden rounded-t-md px-4 py-3 ${
							activeButton === 'Rincian' ? 'btn-active border-b-2' : 'bg-[#D9D9D9]'
						}`}
						on:click={() => navigateTo('/main/rincian_pasien')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
							<mask
								id="a"
								width="20"
								height="20"
								x="2"
								y="2"
								maskUnits="userSpaceOnUse"
								style="mask-type:luminance"
							>
								<path
									fill="#fff"
									stroke="#fff"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Z"
								/>
								<path
									fill="#000"
									stroke="#000"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6.5 6.5h4v4h-4v-4Z"
								/>
								<path
									stroke="#000"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.5 6.5h4m-4 3.5h4m-11 4h11m-11 3.5h11"
								/>
							</mask>
							<g mask="url(#a)">
								<path fill="#45496A" d="M0 0h24v24H0V0Z" />
							</g>
						</svg>
						<span class="font-bold">Rincian</span>
					</button>
					<button
						class={`flex items-center justify-center gap-5 overflow-hidden rounded-t-md px-4 py-3 ${
							activeButton === 'Riwayat Screening' ? 'btn-active border-b-2' : 'bg-[#D9D9D9]'
						}`}
						on:click={() => navigateTo('/main/riwayat_screening')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none">
							<path
								fill="#45496A"
								d="M12.5 21c-2.1 0-3.958-.637-5.575-1.912s-2.667-2.904-3.15-4.888a.74.74 0 0 1 .15-.687.978.978 0 0 1 .675-.363 1.09 1.09 0 0 1 .725.15c.217.133.367.333.45.6.4 1.5 1.225 2.725 2.475 3.675C9.5 18.525 10.917 19 12.5 19c1.95 0 3.604-.679 4.963-2.037 1.359-1.358 2.038-3.012 2.037-4.963 0-1.95-.68-3.605-2.037-4.962C16.106 5.681 14.451 5.001 12.5 5a6.75 6.75 0 0 0-3.225.8A7.431 7.431 0 0 0 6.75 8H8.5c.283 0 .521.096.713.288.192.192.288.43.287.712 0 .283-.097.52-.288.713A.957.957 0 0 1 8.5 10h-4a.965.965 0 0 1-.712-.288A.972.972 0 0 1 3.5 9V5c0-.283.096-.52.288-.712A.972.972 0 0 1 4.5 4c.283 0 .52.095.713.288A.96.96 0 0 1 5.5 5v1.35a8.73 8.73 0 0 1 3.113-2.475A8.932 8.932 0 0 1 12.5 3c1.25 0 2.421.238 3.513.713a9.16 9.16 0 0 1 2.85 1.924 9.136 9.136 0 0 1 1.925 2.85A8.698 8.698 0 0 1 21.5 12a8.73 8.73 0 0 1-.712 3.513 9.09 9.09 0 0 1-1.925 2.85 9.206 9.206 0 0 1-2.85 1.925A8.663 8.663 0 0 1 12.5 21Zm1-9.4 2.5 2.5a.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275l-2.8-2.8a1 1 0 0 1-.3-.725V8c0-.283.096-.520.288-.712A.972.972 0 0 1 12.5 7c.283 0 .52.095.713.288A.96.96 0 0 1 13.5 8v3.6Z"
							/>
						</svg>
						<span class="font-bold">Riwayat Screening</span>
					</button>
					<button
						class={`flex items-center justify-center gap-5 overflow-hidden rounded-t-md px-4 py-3 ${
							activeButton === 'Input Screening' ? 'btn-active border-b-2' : 'bg-[#D9D9D9]'
						}`}
						on:click={() => navigateTo('/main/input_screening')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none">
							<path
								stroke="#45496A"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.5 22h14a2 2 0 0 0 2-2V7l-5-5h-9a2 2 0 0 0-2 2v4"
							/>
							<path
								stroke="#45496A"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.5 2v4a2 2 0 0 0 2 2h4m-18 7h10m0 0-3 3m3-3-3-3"
							/>
						</svg>
						<span class="font-bold">Input Screening</span>
					</button>
					<button
						class={`flex items-center justify-center gap-5 overflow-hidden rounded-t-md px-4 py-3 ${
							activeButton === 'Konsultasi Lab' ? 'btn-active border-b-2' : 'bg-[#D9D9D9]'
						}`}
						on:click={() => navigateTo('/main/konsultasi_lab')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" fill="none">
							<path
								fill="#45496A"
								d="M5.5 10a.97.97 0 0 1-.712-.288A.97.97 0 0 1 4.5 9q0-.424.288-.712A.97.97 0 0 1 5.5 8h6q.425 0 .713.288T12.5 9t-.288.713A.96.96 0 0 1 11.5 10zm0-4a.97.97 0 0 1-.712-.288A.97.97 0 0 1 4.5 1q0-.424.288-.712A.97.97 0 0 1 5.5 4h6q.425 0 .713.288.288.289.287.712 0 .424-.288.713A.96.96 0 0 1 11.5 6zm-3 6H10q.724 0 1.35.313t1.05.887l2.1 2.75V2h-12zm0 6h11.05l-2.725-3.575a1.1 1.1 0 0 0-.362-.312A1 1 0 0 0 10 14H2.5zm12 2h-12q-.825 0-1.412-.587A1.93 1.93 0 0 1 .5 18V2q0-.824.588-1.412A1.93 1.93 0 0 1 2.5 0h12q.825 0 1.413.588T16.5 2v16q0 .825-.587 1.413A1.92 1.92 0 0 1 14.5 20"
							/>
						</svg>
						<span class="font-bold">Konsultasi Lab</span>
					</button>
				</nav>
			</div>
			<div
				class="flex min-h-[83px] items-center justify-center gap-6 self-start rounded-lg bg-slate-600 px-5 py-1.5 max-md:px-5"
				role="status"
				aria-label="Current Queue Number"
			>
				<div class="my-auto self-stretch text-xl text-white">
					<span class="font-bold">Nomor antrian saat ini</span>
				</div>
				<div
					class="h-[71px] w-0 shrink-0 self-stretch border border-solid border-white bg-white"
					role="separator"
				></div>
				<div class="relative my-auto flex w-[59px] items-center justify-center">
					<div
						class="z-0 flex h-[59px] w-[59px] shrink-0 items-center justify-center rounded-lg bg-amber-300 shadow-sm"
					>
						<span class="text-4xl text-black">{data.detail_antrian?.nomor_antrian ?? ''}</span>
					</div>
				</div>
			</div>
		</header>
	</div>

	<div class="content">
		{@render children()}
	</div>
</main>

<style>
	.btn-active {
		background-color: #ffffff;
		border-bottom: none;
	}

	button:hover {
		background-color: #d9d9d9;
		border-bottom: 2px solid rgba(0, 0, 0, 0.19);
		transition: all 0.3s ease;
	}
</style>
