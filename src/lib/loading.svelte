<script lang="ts">
	let isLoading = true;
	let selectedAnimation = 'suntik';
	let showBottle = false;
	let showSyringe = true;
	let drawLiquid = false;
	let ejectLiquid = false;
	let spinSyringe = false;

	// Function to toggle the animation
	function toggleLoading() {
		isLoading = !isLoading;
		if (isLoading) {
			// Reset all states
			showBottle = false;
			showSyringe = false;
			drawLiquid = false;
			ejectLiquid = false;
			spinSyringe = false;

			// Animation sequence
			setTimeout(() => {
				showBottle = true;
				setTimeout(() => {
					showSyringe = true;
					setTimeout(() => {
						drawLiquid = true;
						setTimeout(() => {
							ejectLiquid = true;
							setTimeout(() => {
								showBottle = false;
								setTimeout(() => {
									spinSyringe = true;
								}, 1000);
							}, 1500);
						}, 500);
					}, 500);
				}, 500);
			}, 100);
		}
	}

	// Start animation sequence on initialization
	$: if (isLoading && selectedAnimation === 'suntik') {
		setTimeout(() => {
			showBottle = true;
			setTimeout(() => {
				showSyringe = true;
				setTimeout(() => {
					drawLiquid = true;
					setTimeout(() => {
						ejectLiquid = true;
						setTimeout(() => {
							showBottle = false;
							setTimeout(() => {
								spinSyringe = true;
							}, 1000);
						}, 1500);
					}, 500);
				}, 500);
			}, 500);
		}, 100);
	}
</script>

{#if isLoading}
	<div class="fixed inset-0 flex items-center justify-center bg-none">
		{#if selectedAnimation === 'suntik'}
			<div class="container">
				<!-- Medicine Bottle -->
				{#if showBottle}
					<div class="botol-obat" class:enter={showBottle} class:exit={!showBottle}>
						<div class="tutup-botol"></div>
						<div class="leher-botol"></div>
						<div class="badan-botol">
							<div class="label">
								<div class="logo"></div>
								<div></div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Medicine Syringe -->
				{#if showSyringe}
					<div class="suntikan" class:enter={showSyringe} class:spin={spinSyringe}>
						<div class="kepala-suntikan" class:draw={drawLiquid} class:eject={ejectLiquid}></div>
						<div class="leher-suntikan"></div>
						<div class="badan-suntikan">
							{#if ejectLiquid}
								<div class="cairan-suntikan"></div>
							{/if}
						</div>
						<div class="cap"></div>
						<div class="jarum"></div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.container {
		position: relative;
		width: 500px;
		height: 500px;
		image-rendering: pixelated;
	}

	/* All CSS Botol */
	/* Botol Obat */
	.botol-obat {
		position: absolute;
		width: 70px;
		height: 85px;
		top: 66%;
		left: 42%;
		transform: translate(-50%, -50%);
		animation:
			bottleEnter 1.5s forwards,
			bottleExit 1.5s forwards 3s;
	}

	/* Leher Botol */
	.leher-botol {
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 35px;
		height: 10px;
		background: #ff5f7a;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
	}

	/* Tutup Botol */
	.tutup-botol {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		width: 35px;
		height: 15px;
		background: #f5deb3;
		border-radius: 5px;
		background-image: linear-gradient(to right, #ffc263 90%, #ffaa5a 5%);
	}

	.badan-botol {
		width: 100%;
		height: 100%;
		background: #ff5f7a;
		position: relative;
		overflow: hidden;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		background-image: linear-gradient(to right, #ff5f7a 90%, #fb4455 5%);
	}

	.label {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		width: 70px;
		height: 55px;
		background: rgba(255, 255, 255, 0.7); /* Semi-transparan */
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo {
		position: relative;
		width: 20px;
		height: 20px;
	}

	.logo::before,
	.logo::after {
		content: '';
		position: absolute;
		background-color: #ff1493; /* Pink */
	}

	.logo::before {
		width: 100%;
		height: 6px;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}

	.logo::after {
		width: 6px;
		height: 100%;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.logo::before,
	.logo::after {
		content: '';
		position: absolute;
		background-color: #ff1493; /* Pink */
	}

	.logo::before {
		width: 100%;
		height: 6px;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}

	.logo::after {
		width: 6px;
		height: 100%;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	@keyframes bottleEnter {
		0% {
			opacity: 0;
			transform: translateY(50px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes bottleExit {
		20% {
			-webkit-transform: scale3d(0.9, 0.9, 0.9);
			-ms-transform: scale3d(0.9, 0.9, 0.9);
			transform: scale3d(0.9, 0.9, 0.9);
		}
		50%,
		55% {
			opacity: 1;
			-webkit-transform: scale3d(1.1, 1.1, 1.1);
			-ms-transform: scale3d(1.1, 1.1, 1.1);
			transform: scale3d(1.1, 1.1, 1.1);
		}
		100% {
			opacity: 0;
			-webkit-transform: scale3d(0.3, 0.3, 0.3);
			-ms-transform: scale3d(0.3, 0.3, 0.3);
			transform: scale3d(0.3, 0.3, 0.3);
		}
	}

	/* All CSS Suntikan */
	.suntikan {
		position: absolute;
		top: 25%;
		left: 45%;
		transition: all 0.5s ease-in-out;
		animation: syringeEnter 2.8s forwards;
		transform: rotate(-45deg); /* Rotate the syringe to match the angle in syringe.png */
	}

	/* Badan Suntikan (Barrel/Body) */
	.badan-suntikan {
		width: 40px;
		height: 100px;
		background: linear-gradient(
			to right,
			#c5e2ff 50%,
			#a3d1ff 50%
		); /* Blue gradient for the barrel */
		border: 3px solid black; /* Solid black border to match the style */
		border-radius: 10px;
		position: relative; /* Changed to relative for better positioning of child elements */
	}

	/* Leher Suntikan */
	.leher-suntikan {
		width: 20px;
		height: 10px;
		background: #c5e2ff;
		border: 3px solid black;
		border-radius: 5px;
		position: absolute;
		top: -13px;
		left: 50%;
		transform: translateX(-50%);
	}

	/* Kepala Suntikan */
	.kepala-suntikan {
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 20px;
		background: #ff5f7a;
		border: 3px solid black;
		border-radius: 5px;
		transition: all 1s ease-in-out;
	}

	.kepala-suntikan.draw {
		top: 80px;
	}

	.kepala-suntikan.eject {
		top: -30px;
		transition: all 0.3s ease-out;
	}

	.cap {
		width: 20px;
		height: 10px;
		background: #a3d1ff;
		border: 3px solid black;
		border-radius: 5px;
		position: absolute;
		bottom: -13px;
		left: 50%;
		transform: translateX(-50%);
	}

	/* Jarum Suntikan*/
	.jarum {
		width: 5px;
		height: 40px;
		background: #c5e2ff;
		border: 3px solid black;
		position: absolute;
		bottom: -53px;
		left: 50%;
		transform: translateX(-50%);
	}

	.jarum::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 5px;
		height: 10px;
		background: white;
		border: 3px solid black;
	}

	.cairan-suntikan {
		width: 20px;
		height: 40px;
		background: linear-gradient(90deg, #7ed32155, #7ed321aa);
		position: absolute;
		bottom: -0px;
		left: 50%;
		transform: translateX(-50%);
		animation: spray 0.5s ease-out;
		border-radius: 0 0 10px 10px;
	}

	.spin {
		transform: translateX(-50%, -50%);
		animation: spin 2.5s steps(8) infinite;
	}

	/* Animations */
	@keyframes syringeEnter {
		0% {
			opacity: 0;
			-webkit-transform: translate3d(0, -30px, 0);
			-ms-transform: translate3d(0, -30px, 0);
			transform: translate3d(0, -30px, 0);
		}
		60% {
			opacity: 1;
			-webkit-transform: translate3d(0, 25px, 0);
			-ms-transform: translate3d(0, 25px, 0);
			transform: translate3d(0, 25px, 0);
		}
		75% {
			-webkit-transform: translate3d(0, -10px, 0);
			-ms-transform: translate3d(0, -10px, 0);
			transform: translate3d(0, -10px, 0);
		}
		90% {
			-webkit-transform: translate3d(0, 5px, 0);
			-ms-transform: translate3d(0, 5px, 0);
			transform: translate3d(0, 5px, 0);
		}
		100% {
			-webkit-transform: none;
			-ms-transform: none;
			transform: none;
		}
	}

	@keyframes spray {
		0% {
			height: 0;
			opacity: 1;
		}
		100% {
			height: 40px;
			opacity: 0;
		}
	}

	@keyframes spin {
		0% {
			-webkit-transform-origin: center;
			-ms-transform-origin: center;
			transform-origin: center;
			-webkit-transform: rotate3d(0, 0, 1, -360deg);
			-ms-transform: rotate3d(0, 0, 1, -360deg);
			transform: rotate3d(0, 0, 1, -360deg);
		}
		50% {
			-webkit-transform-origin: center;
			-ms-transform-origin: center;
			transform-origin: center;
			-webkit-transform: rotate3d(0, 0, 1, 0deg);
			-ms-transform: rotate3d(0, 0, 1, 0deg);
			transform: rotate3d(0, 0, 1, 0deg);
		}
		100% {
			-webkit-transform-origin: center;
			-ms-transform-origin: center;
			transform-origin: center;
			-webkit-transform: rotate3d(0, 0, 1, 360deg);
			-ms-transform: rotate3d(0, 0, 1, 360deg);
			transform: rotate3d(0, 0, 1, 360deg);
		}
	}
</style>
