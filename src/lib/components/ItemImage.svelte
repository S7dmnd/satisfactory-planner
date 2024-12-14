<script lang="ts">
	import itemNameMapping from '$lib/itemNameMapping.json';

	let { itemName, style } = $props();
</script>

<img src="/src/lib/images/{itemNameMapping[itemName]}.webp" alt={itemName} {style} />

<style>
	img {
		object-fit: contain;
	}
</style>
