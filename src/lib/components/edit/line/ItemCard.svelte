<script lang="ts">
	import ItemImage from '$lib/components/ItemImage.svelte';

	let { itemName, itemAmount, lineAmount = $bindable(), todoAmount = $bindable() } = $props();
</script>

<div class="item-card-container">
	<ItemImage {itemName} style="width: 128px; height: 128px;" />
	<div>{itemName}</div>
	<div class="input-container">
		<input
			type="number"
			value={itemAmount * lineAmount}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				lineAmount = parseFloat(target.value) / itemAmount;
			}}
		/>
	</div>
	<div class="input-container todo-container">
		<div>
			(<span style="color:transparent">{itemAmount * todoAmount}</span>)
		</div>
		<input
			type="number"
			value={itemAmount * todoAmount}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				todoAmount = parseFloat(target.value) / itemAmount;
			}}
		/>
	</div>
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

	.input-container {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		width: calc(100% - 22px);
	}

	.todo-container {
		position: relative;
		color: red;
	}
	.todo-container > div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}

	input {
		background-color: transparent;
		width: 100%;
		appearance: textfield;
		text-align: center;
	}

	/* Hide the spinner for Webkit browsers */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
