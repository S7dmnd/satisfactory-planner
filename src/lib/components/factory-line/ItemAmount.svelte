<script lang="ts">
	let { itemAmount } = $props();
</script>

<div class="item-amount-container">
	{#each itemAmount as item}
		<button class="item-button">
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
	}

	.item-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.item-button:active {
		transform: translateY(0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.item-button > div {
		/* 필요한 경우 추가 스타일 적용 */
	}
</style>
