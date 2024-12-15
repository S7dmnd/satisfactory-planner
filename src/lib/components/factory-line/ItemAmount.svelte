<script lang="ts">
	import { roundDouble } from '$lib/math';
	import ItemImage from '../ItemImage.svelte';

	let { itemAmount, selectedItem = $bindable('') } = $props();

	let searchText = $state('');
	let filteredItems = $derived.by(() => {
		if (!searchText || searchText.trim() === '') {
			return itemAmount;
		}

		return itemAmount.filter((item) =>
			item.ITEMNAME.toLowerCase().includes(searchText.toLowerCase())
		);
	});
</script>

<div>
	<input type="text" placeholder="Search items" bind:value={searchText} />
	<div class="item-amount-container">
		{#each filteredItems.sort((a, b) => a.AMOUNT - b.AMOUNT) as item}
			<button
				class="item-button {item.AMOUNT < 0
					? 'negative'
					: item.AMOUNT == 0
						? 'zero'
						: 'positive'} {selectedItem === item.ITEMNAME ? 'selected' : ''}"
				onclick={() => (selectedItem = selectedItem === item.ITEMNAME ? '' : item.ITEMNAME)}
			>
				<ItemImage itemName={item.ITEMNAME} style="width: 80px; height: 80px;" />
				<div class="item-name">{item.ITEMNAME}</div>
				<div class="item-amount">{roundDouble(item.AMOUNT)}</div>
			</button>
		{/each}
	</div>
</div>

<style>
	input {
		padding: 10px;
		width: 50%;
		font-size: 1rem;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
	}

	.item-amount-container {
		overflow-x: auto; /* 가로 스크롤 활성화 */
		white-space: nowrap; /* 자식 요소들이 한 줄로 정렬 */
		display: flex;
		padding: 10px;
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

	.item-button.negative {
		background-color: rgba(250, 98, 72, 1);
	}
	.item-button.zero {
		background-color: rgba(72, 136, 250, 1);
	}
	.item-button.positive {
		background-color: rgba(250, 149, 73, 1);
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
</style>
