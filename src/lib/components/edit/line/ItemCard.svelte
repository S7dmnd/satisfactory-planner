<script lang="ts">
	let { itemName, itemAmount, lineAmount = $bindable(), todoAmount = $bindable() } = $props();
</script>

<div>
	<img src="/src/lib/images/{itemName}.webp" alt={itemName} />
	<div>{itemName}</div>
	<div>{itemAmount * lineAmount}</div>
	<div style="color: red;">({itemAmount * todoAmount})</div>
</div>

<style>
	img {
		width: 128px;
		height: 128px;
		object-fit: contain;
	}
</style>
