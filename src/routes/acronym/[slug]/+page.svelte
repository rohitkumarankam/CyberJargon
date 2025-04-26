<script>
	import { marked } from 'marked';

	let { data } = $props();
</script>

{#if data.acronym}
	<div class="acronym">
		<!-- {JSON.stringify(data.acronym)} -->
		<!-- <h1>{data.acronym.slug}</h1> -->

		<h1>{data.acronym.full_form}({data.acronym.acronym})</h1>
		<p>{data.acronym.description}</p>
		<p>{@html marked(data.acronym.markdown)}</p>
		{#if data.acronym.related && data.acronym.related.length > 0}
			<br />
			<br />
			<br />
			<h4>Related Acronyms</h4>
			<ul>
				{#each data.acronym.related as related}
					<li><a href="/acronym/{related}">{related}</a></li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	<p>404</p>
{/if}
