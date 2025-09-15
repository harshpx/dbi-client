import { get, writable, type Writable } from "svelte/store";

export type Themes = "light" | "dark";

const getInitialTheme = (): Themes => {
	// SSR default
	if (typeof window === "undefined") return "dark";

	// check local storage
	const lastUsedTheme = localStorage.getItem("theme");
	if (lastUsedTheme && (lastUsedTheme === "dark" || lastUsedTheme === "light")) {
		return lastUsedTheme;
	}
	// // check system preference
	// const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	// return userPrefersDark ? "dark" : "light";
	// default to dark
	return "dark";
};

export const theme: Writable<Themes> = writable(getInitialTheme());

// update global theme and local storage whenever theme store changes
theme.subscribe((value: Themes) => {
	if (typeof window === "undefined") return;
	localStorage.setItem("theme", value);
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(value);
});

export const toggleTheme = () => {
	theme.set(get(theme) === "light" ? "dark" : "light");
};
