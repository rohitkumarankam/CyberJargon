<script lang="ts">
	import axios from 'axios';
	import { debounce } from 'lodash-es';
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';

	let searchTerm = $state('');
	let results = $state<any[]>([]);
	let isSearching = $state(false);
	let hasResults = $state(false); // Track if we have any results
	let abortController = $state<AbortController | null>(null);

	// Cache for storing search results during the session
	const searchCache = $state<Record<string, any[]>>({});

	// Debounced search function
	const debouncedSearch = debounce(async (term: string) => {
		try {
			// Check if we have cached results for this term
			if (searchCache[term]) {
				results = searchCache[term];
				hasResults = results.length > 0;
				isSearching = false;
				return;
			}

			if (abortController) {
				abortController.abort();
			}

			abortController = new AbortController();
			isSearching = true;

			const response = await axios.get(env.PUBLIC_MEILISEARCH_URL + '/indexes/acronyms/search', {
				params: { q: term },
				headers: { Authorization: `Bearer ${env.PUBLIC_MEILISEARCH_KEY}` },
				signal: abortController.signal
			});

			if (term === searchTerm) {
				results = response.data.hits;
				hasResults = results.length > 0;

				// Cache the results
				if (browser) {
					searchCache[term] = results;
				}
			}
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('Search error:', error);
				if (term === searchTerm) {
					results = [];
					hasResults = false;
				}
			}
		} finally {
			if (term === searchTerm) {
				isSearching = false;
			}
		}
	}, 50);

	// Reactive effect with cleanup
	$effect(() => {
		const currentSearch = searchTerm;

		if (!currentSearch) {
			results = [];
			isSearching = false;
			hasResults = false;
			return;
		}

		debouncedSearch(currentSearch);

		return () => {
			// Cancel pending debounced search and any ongoing request
			debouncedSearch.cancel();
			if (abortController) {
				abortController.abort();
				abortController = null;
			}
		};
	});
</script>

<div class="container">
	<h1>Cyber Jargon</h1>
	<!-- <h1>Cyber Jargon</h1> -->
	<p>Acronyms search engine for ever evolving terminology</p>
	<input type="text" bind:value={searchTerm} placeholder="Start typing: e.g. API, SOC, IDS..." />

	{#if results.length > 0}
		<ul>
			{#each results as result}
				<li>
					<a href="/acronym/{result.slug}">{result.full_form} ({result.acronym})</a>
				</li>
			{/each}
		</ul>
	{:else if isSearching && !hasResults}
		<p>Searching...</p>
	{:else if searchTerm}
		<p>No results found</p>
		<!-- {:else}
		<p>Here are some suggestions:</p>
		<ul>
			<li><a href="/acronym/advanced-package-tool">APT (Advanced Package Tool)</a></li>
			<li><a href="/acronym/advanced-persistent-threat">APT (Advanced Persistent Threat)</a></li>
			<li><a href="/acronym/iot">IoT (Internet of Things)</a></li>
		</ul> -->
	{/if}
</div>

<style>
	.container {
		max-width: 650px;
		margin: 100px auto 0;
		padding: 20px;
		text-align: center;
	}

	/* h1 {
		color: #4285f4;
		font-size: 2.5rem;
		margin-bottom: 0.2rem;
		font-weight: normal;
	}

	p {
		color: #5f6368;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	} */

	input {
		width: 100%;
		padding: 12px 20px;
		margin: 24px 0 20px;
		border: 1px solid #dfe1e5;
		border-radius: 24px;
		box-sizing: border-box;
		font-size: 16px;
		box-shadow: 0 1px 6px rgba(32, 33, 36, 0.08);
		transition: box-shadow 0.3s;
	}

	input:focus {
		box-shadow: 0 1px 10px rgba(32, 33, 36, 0.15);
		outline: none;
		border-color: #dfe1e5;
	}

	ul {
		list-style-type: none;
		padding: 0;
		text-align: left;
		margin-top: 24px;
	}

	li {
		margin-bottom: 16px;
		padding: 4px 0;
		padding-left: 12px;
		border-radius: 0;
		background-color: transparent;
	}

	a {
		text-decoration: none;
		color: #1a0dab;
		display: block;
		font-size: 18px;
	}

	:root[data-theme='dark'] {
		a {
			color: #8ab4f8;
		}
	}

	a:hover {
		text-decoration: underline;
	}
</style>
