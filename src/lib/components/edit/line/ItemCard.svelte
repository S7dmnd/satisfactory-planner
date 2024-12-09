<script lang="ts">
	let { itemName, itemAmount, lineAmount = $bindable(), todoAmount = $bindable() } = $props();
</script>

<div class="item-card-container">
	<img src="/src/lib/images/{itemName}.webp" alt={itemName} />
	<div>{itemName}</div>
	<input type="number" value={itemAmount * lineAmount} />
	<input type="text" value="({itemAmount * todoAmount})" style="color: red;" />
</div>

<style>
	.item-card-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20px;
		padding: 20px;
		border-radius: 10px;
		background-color: rgba(14, 14, 14, 255);
		border: 1px solid rgba(250, 149, 73, 255);
	}

	img {
		width: 128px;
		height: 128px;
		object-fit: contain;
	}

	input {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		width: calc(100% - 22px);
		appearance: textfield;
		text-align: center;
	}

	/* Hide the spinner for Webkit browsers */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
