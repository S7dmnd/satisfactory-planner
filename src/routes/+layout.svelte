<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';

	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

{#if !ready}
	<Loading message="Loading..." />
{/if}
{@render children()}
