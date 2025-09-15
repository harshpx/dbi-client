<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";
	import { theme, toggleTheme } from "$/Contexts/theme";
	import Button from "$/Components/Button.svelte";
</script>

<Button onClick={toggleTheme} className="h-8 w-8 sm:h-9 sm:w-9">
	{#if $theme === "dark"}
		<Moon class="stroke-3" />
	{:else}
		<Sun class="stroke-3" />
	{/if}
</Button>
