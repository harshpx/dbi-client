<script lang="ts">
	export let size: number = 50;
	export let stroke: string = "#ffffff";
</script>

<div
	class="absolute top-0 left-0 z-20 flex min-h-screen min-w-screen items-center justify-center bg-black/40"
>
	<svg
		width={size}
		height={size}
		viewBox="0 0 50 50"
		class="animate-spin"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			cx="25"
			cy="25"
			r="20"
			fill="none"
			{stroke}
			stroke-width="5"
			stroke-linecap="round"
			stroke-dasharray="31.4 94.2"
		/>
	</svg>

	<style>
		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
		.animate-spin {
			animation: spin 1s linear infinite;
			transform-origin: center;
		}
	</style>
</div>
