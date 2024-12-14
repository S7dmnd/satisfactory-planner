<script lang="ts">
	let { itemName, style } = $props();
</script>

<img src="/src/lib/images/{itemName}.webp" alt={itemName} {style} />

<style>
	img {
		object-fit: contain;
	}
</style>
