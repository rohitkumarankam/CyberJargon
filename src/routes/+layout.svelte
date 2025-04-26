<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="container">
	{@render children()}
</div>

<style>
	.container {
		max-width: 768px;
		margin: auto;
		padding: 20px;
	}
</style>
