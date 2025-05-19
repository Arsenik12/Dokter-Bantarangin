<script lang="ts">
	import { onMount } from 'svelte';
	import Loading from '../lib/loading.svelte';

	let username = '';
	let password = '';
	let selectedPoli = '';
	let poliklinikList: any[] = [];
	let errorMessage = '';
	let isLoading = false;

	// Ambil daftar poliklinik dari endpoint baru
	async function fetchPoliklinik() {
		try {
			const response = await fetch('/?poli=true', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.message);
			}

			poliklinikList = result.data;
			console.log('✅ Data poliklinik:', poliklinikList);
		} catch (error) {
			console.error('❌ Gagal mengambil data poliklinik:', error);
			errorMessage = 'Gagal memuat daftar poliklinik.';
		}
	}

	onMount(fetchPoliklinik);

	async function handleLogin(event: Event) {
		event.preventDefault();
		isLoading = true;

		try {
			const response = await fetch('/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ username, password, id_poli: selectedPoli }),
				credentials: 'include'
			});

			const result = await response.json();

			if (response.ok) {
				// Show loading animation for 4 seconds before redirecting
				setTimeout(() => {
					window.location.href = '/main/rincian_pasien';
				}, 4000);
			} else {
				errorMessage = result.message || 'Login gagal. Periksa kembali username, password, dan poliklinik Anda.';
				isLoading = false;
			}
		} catch (error) {
			console.error('❌ Login error:', error);
			errorMessage = 'Terjadi kesalahan saat menghubungi server.';
			isLoading = false;
		}
	}
</script>

<div class="relative h-screen w-screen overflow-hidden bg-zinc-100">
	<img
		src="/assets/clinic.jpg"
		alt="Healthcare facility exterior view"
		class="absolute inset-0 h-full w-full object-cover"
	/>
	<div class="relative grid h-full w-full grid-cols-2">
		<!-- Column 1 -->
		<div class="relative flex h-full w-full items-center justify-center"></div>
		<!-- Column 2 -->
		<div class="relative flex h-full w-full items-center justify-center">
			<img
				src="/assets/bg_login.png"
				alt=""
				class="absolute inset-0 h-full w-full rounded-[50px] object-cover"
			/>
			<div class="relative w-full h-full pt-20 justify-items-center">
				<div class="ml-16 grid justify-items-center">
					<img src="/assets/logos/bantarangin.png" alt="Hospital Logo" class="h-auto w-auto" />
				</div>

				<h1 class="mb-6 ml-16 text-center text-2xl font-bold text-gray-800">
					HOSPITEL BANTARANGIN <br /> GENERAL HOSPITAL
				</h1>
				<div class="ml-16 grid justify-items-center">
					<form on:submit={handleLogin} class="space-y-6">
						{#if errorMessage}
							<div
								class="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-center text-red-600"
							>
								⚠️ {errorMessage}
							</div>
						{/if}

						<div>
							<label for="username" class="block text-sm font-bold text-gray-700">
								Username <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="username"
								placeholder="Username"
								bind:value={username}
								required
								class="h-auto w-[512px] rounded-md border border-gray-300 px-4 py-3"
							/>
						</div>

						<div>
							<label for="password" class="block text-sm font-bold text-gray-700">
								Password <span class="text-red-500">*</span>
							</label>
							<input
								type="password"
								id="password"
								placeholder="Password"
								bind:value={password}
								required
								class="h-auto w-[512px] rounded-md border border-gray-300 px-4 py-3"
							/>
						</div>

						<div>
							<label for="role" class="block text-sm font-bold text-gray-700">
								Poliklinik <span class="text-red-500">*</span>
							</label>
							<select
								id="role"
								bind:value={selectedPoli}
								required
								class="h-auto w-[512px] appearance-none rounded-md border border-gray-300 px-4 py-3 text-gray-900"
							>
								<option value="">-- Pilih poliklinik --</option>
								{#each poliklinikList as poli}
									<option value={poli.id_poli}>{poli.nama_poli}</option>
								{/each}
							</select>
						</div>

						<button
							type="submit"
							class="h-auto w-[512px] rounded-md bg-[#F6C445] px-4 py-3 font-bold text-black shadow-sm transition hover:bg-yellow-500"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

{#if isLoading}
	<Loading />
{/if}