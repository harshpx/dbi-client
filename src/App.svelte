<script lang="ts">
	import ThemeSwitch from "$/Components/ThemeSwitch.svelte";
	import { Dog, Link2, PawPrint, Upload, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";
	import Button from "./Components/Button.svelte";
	import {
		checkApiHealth,
		getPredictionFromFile,
		getPredictionFromUrl,
		type CommonResponse,
		type PredictionResponse,
	} from "./services/dbiService";
	import Loader from "./Components/Loader.svelte";
	import { cleanLabel, formatConfidence, validateImageUrl } from "./utils/common";

	let source: string = $state("upload");
	let imageUrl: string = $state("");

	let fileInput: HTMLInputElement | null = $state(null);
	let textInput: HTMLInputElement | null = $state(null);

	let prediction: PredictionResponse | null = $state(null);

	let loading: boolean = $state(false);

	type SourceButton = {
		name: string;
		description: string;
		icon: Component<IconProps>;
		onclick: () => void;
		sourceName: string;
	};

	const sourceButtons: SourceButton[] = [
		{
			name: "Upload",
			description: "Any dog image from your device",
			icon: Upload,
			onclick: () => {
				if (source !== "upload") {
					source = "upload";
					imageUrl = "";
					prediction = null;
				}
			},
			sourceName: "upload",
		},
		{
			name: "Url",
			description: "Of any dog image on internet",
			icon: Link2,
			onclick: () => {
				if (source !== "url") {
					source = "url";
					imageUrl = "";
					prediction = null;
				}
			},
			sourceName: "url",
		},
	];

	const handleCheckApiHealth = async () => {
		try {
			const response: CommonResponse<String> = await checkApiHealth();
			if (response.success) {
				alert("API is healthy and reachable.");
			} else {
				alert("API is down. Please try again later.");
				console.error("API Health Check Failed:", response.response);
			}
		} catch (error) {
			alert("API is down. Please try again later.");
			console.error("API Health Check Error:", error);
		}
	};

	const clearFileInput = () => {
		if (fileInput) {
			fileInput.value = "";
			imageUrl = "";
			prediction = null;
		}
	};

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files ? target.files?.[0] : null;
		if (file) {
			imageUrl = URL.createObjectURL(file);
		} else {
			imageUrl = "";
		}
		prediction = null;
	};

	const fetchImageFromUrl = () => {
		if (textInput) {
			if (validateImageUrl(textInput.value)) {
				imageUrl = textInput.value;
			} else {
				alert("Please enter a valid image URL.");
				textInput.value = "";
				imageUrl = "";
			}
		}
		prediction = null;
	};

	const handleImageError = () => {
		alert("Failed to load image. Check url / file and try again.");
		imageUrl = "";
		if (fileInput) fileInput.value = "";
		if (textInput) textInput.value = "";
		prediction = null;
	};

	const handlePrediction = async () => {
		try {
			loading = true;
			if (source === "upload") {
				if (fileInput && fileInput.files && fileInput.files[0]) {
					const file = fileInput.files[0];
					const response: CommonResponse<PredictionResponse> = await getPredictionFromFile(file);
					if (response.success) {
						prediction = response.response;
					} else {
						alert("Failed to get prediction. Please try again.");
						console.error("Prediction Failed: ", response.response);
						prediction = null;
					}
				} else {
					alert("No file selected. Please choose an image file.");
					prediction = null;
				}
			} else if (source === "url") {
				if (imageUrl) {
					const response: CommonResponse<PredictionResponse> = await getPredictionFromUrl(imageUrl);
					if (response.success) {
						prediction = response.response;
					} else {
						alert("Failed to get prediction. Please try again.");
						console.error("Prediction Failed: ", response.response);
						prediction = null;
					}
				} else {
					alert("No image URL provided. Please enter a valid URL.");
					prediction = null;
				}
			}
		} catch (error) {
			console.error("Prediction Error: ", error);
			alert("Failed to get prediction. Please try again.");
			prediction = null;
		} finally {
			loading = false;
		}
	};
</script>

{#if loading}
	<Loader />
{/if}
<div class="flex min-h-screen min-w-full flex-col overflow-x-hidden overflow-y-auto p-4 sm:p-8">
	<div class="relative flex grow flex-col items-center justify-center md:flex-row">
		<!-- Theme Switch -->
		<div class="absolute top-0 right-0"><ThemeSwitch /></div>
		<!-- Main -->
		<div class="flex h-full w-full flex-col items-center justify-center md:w-1/2">
			<!-- Title -->
			<div class="flex items-center gap-1">
				<Dog class="h-36 w-36" />
				<div class="flex flex-col gap-1">
					<span class="text-3xl font-light sm:text-4xl">Dog Breed <br />Identifier</span>
					<span class="text-sm font-light sm:text-base dark:font-extralight">
						Identify dog breeds from images
					</span>
				</div>
			</div>
			<!-- Check API Health Button -->
			<Button onClick={handleCheckApiHealth} className="text-[11px] w-fit">Check API health</Button>
			<!-- Source Buttons -->
			<div class="mt-10 flex items-center justify-center gap-4">
				{#each sourceButtons as btn}
					<button
						onclick={btn.onclick}
						class={`
					box-border flex cursor-pointer
					flex-col gap-2 rounded-xl p-4
					${
						source === btn.sourceName
							? "bg-neutral-800 text-[#d2eefa] dark:bg-[#d2eefa] dark:text-neutral-800"
							: "bg-neutral-800/10 dark:bg-[#d2eefa]/10"
					}
				`}
					>
						<div class="flex items-center gap-2">
							<btn.icon class="h-8 w-8" />
							<span class="text-left text-2xl">{btn.name}</span>
						</div>
						<span class="text-left text-[12px]">{btn.description}</span>
					</button>
				{/each}
			</div>
			<!-- Inputs -->
			<div class="mt-5 flex min-h-32 w-full items-center justify-center">
				{#if source === "upload"}
					<div class="flex flex-col gap-2 sm:flex-row">
						<div class="w-fit cursor-pointer rounded-xl border-2 border-dashed">
							<input
								bind:this={fileInput}
								onchange={handleFileChange}
								type="file"
								accept="image/*"
								class="w-9/10 file:cursor-pointer file:rounded-lg file:border-0 file:bg-neutral-800/10 file:px-4
							file:py-2 file:text-sm file:font-medium file:text-neutral-800/60 hover:file:bg-neutral-800/20 hover:file:text-neutral-800
							sm:w-fit dark:file:bg-[#d2eefa]/10
							dark:file:text-[#d2eefa] hover:dark:file:bg-[#d2eefa]/20 hover:dark:file:text-[#d2eefa]"
							/>
						</div>
						{#if fileInput && imageUrl}
							<Button onClick={clearFileInput}>Clear</Button>
						{/if}
					</div>
				{:else if source === "url"}
					<div class="flex w-full items-center justify-center gap-2">
						<input
							bind:this={textInput}
							type="text"
							placeholder="Enter image URL"
							class="w-3/5 rounded-xl border-2 border-dashed bg-transparent p-2 text-sm focus:border-solid
						focus:ring-0 focus:outline-none sm:w-96"
						/>
						<Button onClick={fetchImageFromUrl}>Fetch</Button>
					</div>
				{/if}
			</div>
		</div>
		<!-- Preview -->
		{#if imageUrl}
			<div class="mt-5 flex flex-col items-center gap-4 md:mt-0 md:w-1/2">
				<span class="text-sm font-light sm:text-lg">Preview</span>
				<!-- svelte-ignore a11y_img_redundant_alt -->
				<img
					src={imageUrl}
					onerror={handleImageError}
					alt="Dog Image"
					class="aspect-auto max-h-80 rounded-xl"
				/>
				<div class="mt-2 flex flex-col items-center gap-2">
					<Button
						onClick={() => {
							if (!prediction) handlePrediction();
							else {
								prediction = null;
								imageUrl = "";
								if (fileInput) fileInput.value = "";
								if (textInput) textInput.value = "";
							}
						}}
						className="flex gap-1"
					>
						<PawPrint class="h-5 w-5" />
						<span class="text-sm">{!prediction ? "Identify breed" : "Check another"}</span>
					</Button>
					{#if prediction}
						<div class="flex flex-col items-center gap-1">
							<div class="flex gap-1">
								<span class="font-light">Label:</span>
								<span>{cleanLabel(prediction.label)}</span>
							</div>
							<div class="flex gap-1">
								<span class="font-light">Confidence:</span>
								<span>{formatConfidence(prediction.confidence)}</span>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
