<script>
	let { data } = $props();
	let acronyms = data.acronyms || [];
</script>

<div class="acronyms">
	{#if acronyms && acronyms.length > 0}
		<ul>
			{#each acronyms as acronym}
				<li><a href="/acronym/{acronym.slug}">{acronym.full_form}({acronym.acronym})</a></li>
			{/each}
		</ul>
	{:else}
		<p>No acronyms found.</p>
	{/if}
</div>
