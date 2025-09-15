<script lang="ts">
	import type { Snippet } from "svelte";

	type ButtonProps = {
		children?: Snippet;
		className?: string;
		onClick?: () => void;
	};
	const { children, className, onClick }: ButtonProps = $props();
</script>

<button
	class={`
    flex cursor-pointer items-center 
    justify-center rounded-xl bg-neutral-800 
		px-2 py-1.5 text-[#d2eefa] dark:bg-[#d2eefa] dark:text-neutral-800
    ${className}
  `}
	onclick={onClick}
>
	{@render children?.()}
</button>
