<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	let { children } = $props();

	// Create a store for the theme
	const theme = writable('system'); // Default to 'system'

	// Update theme and save to localStorage
	function toggleTheme() {
		theme.update((current) => {
			const newTheme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';

			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', newTheme);
			}

			applyTheme(newTheme);
			return newTheme;
		});
	}

	// Apply the theme based on the value
	function applyTheme(themeValue: string) {
		if (themeValue === 'system') {
			const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
		} else {
			document.documentElement.setAttribute('data-theme', themeValue);
		}
	}

	// Handle system theme changes
	function handleSystemThemeChange(event: MediaQueryListEvent) {
		if ($theme === 'system') {
			document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
		}
	}

	// Initialize theme on mount
	onMount(() => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme') || 'system';
			theme.set(savedTheme);
			applyTheme(savedTheme);

			// Add listener for system theme changes
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.addEventListener('change', handleSystemThemeChange);
		}
	});

	// Cleanup on destroy
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		}
	});
</script>

<div class="container">
	<div class="theme-toggle">
		<button onclick={toggleTheme}>
			{$theme === 'light' ? '☀️' : $theme === 'dark' ? '🌙' : '🖥️'}
		</button>
		<a href="https://github.com/rohitkumarankam/CyberJargon" target="_blank" aria-label="GitHub">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.11.81 2.24 0 1.62-.015 2.92-.015 3.32 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
		</a>
	</div>
	{@render children()}
</div>

<style>
	.container {
		max-width: 768px;
		margin: auto;
		padding: 20px;
	}

	.theme-toggle {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		/* gap: 1rem; */
		margin-bottom: 1rem;
	}

	button,
	a {
		background: none;
		border: none;
		cursor: pointer;
		width: 2.5rem; /* Ensure equal width and height */
		height: 2.5rem; /* Ensure equal width and height */
		border-radius: 50%; /* Enforce circular shape */
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.3s,
			color 0.3s;
		text-decoration: none; /* Ensures links look like buttons */
		color: inherit; /* Inherits text color */
	}

	button {
		font-size: 1.5rem; /* Match emoji size to GitHub icon */
	}

	button:hover,
	a:hover {
		background-color: var(--hover-bg);
		color: var(--hover-color);
	}

	svg {
		width: 1.5rem; /* Match GitHub icon size to emoji size */
		height: 1.5rem;
	}
</style>
