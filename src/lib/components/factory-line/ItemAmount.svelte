<script lang="ts">
	let { itemAmount, selectedItem = $bindable('') } = $props();
</script>

<div class="item-amount-container">
	{#each itemAmount as item}
		<button
			class="item-button {selectedItem === item.ITEMNAME ? 'selected' : ''}"
			onclick={() => (selectedItem = selectedItem === item.ITEMNAME ? '' : item.ITEMNAME)}
		>
			<img src="/src/lib/images/{item.ITEMNAME}.webp" alt={item.ITEMNAME} />
			<div class="item-name">{item.ITEMNAME}</div>
			<div class="item-amount">{item.AMOUNT}</div>
			<div class="item-todo" style="color: red;">({item.TODOAMOUNT})</div>
		</button>
	{/each}
</div>

<style>
	.item-amount-container {
		display: flex;
	}

	.item-button {
		background-color: rgba(250, 149, 73, 1);
		display: flex;
		flex-direction: column;
		margin: 5px;
		border: none;
		border-radius: 8px;
		padding: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		cursor: pointer;
		align-items: center;
		border: 2px solid transparent; /* 투명한 border 추가 */
	}

	.item-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.item-button:active {
		transform: translateY(0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.item-button.selected {
		border-color: rgba(255, 255, 255, 0.8); /* border 색상 변경 */
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	.item-button > div {
		min-width: 80px;
	}

	.item-button img {
		width: 80px;
		height: 80px;
		object-fit: contain;
		margin-bottom: 5px;
	}
</style>
