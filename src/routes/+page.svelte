<script lang="ts">
	import axios from 'axios';
	import { debounce } from 'lodash-es';
	import { env } from '$env/dynamic/public';

	let searchTerm = $state('');
	let results = $state<any[]>([]);
	let isSearching = $state(false);
	let abortController = $state<AbortController | null>(null);

	// Debounced search function
	const debouncedSearch = debounce(async (term: string) => {
		try {
			if (abortController) {
				abortController.abort();
			}

			abortController = new AbortController();
			isSearching = true;

			const response = await axios.get(env.PUBLIC_MEILISEARCH_URL, {
				params: { q: term },
				headers: { Authorization: `Bearer ${env.PUBLIC_MEILISEARCH_KEY}` },
				signal: abortController.signal
			});

			if (term === searchTerm) {
				results = response.data.hits;
			}
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('Search error:', error);
				if (term === searchTerm) {
					results = [];
				}
			}
		} finally {
			if (term === searchTerm) {
				isSearching = false;
			}
		}
	}, 50); // 300ms debounce delay

	// Reactive effect with cleanup
	$effect(() => {
		const currentSearch = searchTerm;

		if (!currentSearch) {
			results = [];
			isSearching = false;
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

<input type="text" bind:value={searchTerm} />

{#if isSearching}
	<p>Searching...</p>
{:else if results.length > 0}
	<ul>
		{#each results as result}
			<li>{result.acronym}: {result.keys}</li>
		{/each}
	</ul>
{:else if searchTerm}
	<p>No results found</p>
{/if}
