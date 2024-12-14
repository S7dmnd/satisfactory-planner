<script lang="ts">
	import itemNameMapping from '$lib/itemNameMapping.json';

	let { itemName, style } = $props();
</script>

{#await import(`$lib/images/${itemNameMapping[itemName]}.webp`) then { default: src }}
	<img {src} alt={itemName} {style} />
{/await}

<style>
	img {
		object-fit: contain;
	}
</style>
