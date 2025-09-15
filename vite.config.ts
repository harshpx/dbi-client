import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte(), tailwindcss()],
	resolve: {
		alias: {
			$: "/src",
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "https://64.225.85.94.nip.io/",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""), // remove /api prefix
			},
		},
	},
});
