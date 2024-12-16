<script lang="ts">
	import Deliveries from '$lib/components/factory-line/Deliveries.svelte';
	import FactoryLines from '$lib/components/factory-line/FactoryLines.svelte';
	import ItemAmount from '$lib/components/factory-line/ItemAmount.svelte';
	import { getItemAmountByFactory } from '$lib/logic.js';

	let { data } = $props();
	let itemAmountByFactory = getItemAmountByFactory(data.factoryLines, data.deliveries);
	let selectedFactory = $state('');
	let selectedItem = $state('');

	let factoryLines = $derived.by(() => {
		let factoryLines;
		if (selectedFactory === '') {
			factoryLines = data.factoryLines.flatMap((factory) => factory.lines);
		} else {
			const factory = data.factoryLines.find((factory) => factory.FACTORYNAME === selectedFactory);
			factoryLines = factory ? factory.lines : [];
		}

		if (selectedItem !== '') {
			factoryLines = factoryLines.filter(
				(line) =>
					line.INITEMNAME1 === selectedItem ||
					line.INITEMNAME2 === selectedItem ||
					line.INITEMNAME3 === selectedItem ||
					line.INITEMNAME4 === selectedItem ||
					line.OUTITEMNAME1 === selectedItem ||
					line.OUTITEMNAME2 === selectedItem
			);
		}

		return factoryLines;
	});
	let deliveries = $derived.by(() => {
		let deliveries = data.deliveries;
		if (selectedFactory !== '') {
			deliveries = deliveries
				.filter(
					(delivery) =>
						delivery.SOURCEFACTORYNAME === selectedFactory ||
						delivery.DESTINATIONFACTORYNAME === selectedFactory
				)
				.map((delivery) => {
					if (delivery.SOURCEFACTORYNAME === selectedFactory) {
						return {
							...delivery,
							AMOUNT: -delivery.AMOUNT
						};
					}
					return delivery;
				});
		}

		if (selectedItem !== '') {
			deliveries = deliveries.filter((delivery) => delivery.ITEMNAME === selectedItem);
		}

		return deliveries;
	});
	let itemAmount = $derived.by(() => {
		if (selectedFactory === '') {
			return Object.values(itemAmountByFactory)
				.flat()
				.reduce((acc, cur) => {
					const found = acc.find((item) => item.ITEMNAME === cur.ITEMNAME);
					if (found) {
						found.AMOUNT += cur.AMOUNT;
						found.TODOAMOUNT += cur.TODOAMOUNT;
					} else {
						acc.push({ ...cur });
					}
					return acc;
				}, []);
		} else {
			return itemAmountByFactory[selectedFactory] || [];
		}
	});
</script>

<div class="container">
	<div class="factories-container">
		<div class="factories-container-text">Factories:</div>
		<button
			class="factory-button {selectedFactory === '' ? 'selected' : ''}"
			onclick={() => {
				selectedFactory = '';
			}}>전체</button
		>
		{#each data.factoryLines as factories}
			<button
				class="factory-button {selectedFactory === factories.FACTORYNAME ? 'selected' : ''}"
				onclick={() => {
					selectedFactory = factories.FACTORYNAME;
				}}>{factories.FACTORYNAME}</button
			>
		{/each}
	</div>
	<div class="item-list">
		<ItemAmount {itemAmount} bind:selectedItem />
	</div>
	<div class="content">
		<div class="factory-lines">
			<FactoryLines lines={factoryLines} />
		</div>
		<div class="deliveries">
			<Deliveries {deliveries} />
		</div>
	</div>
</div>

<style>
	.factories-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 20px;
	}

	.factories-container-text {
		margin-right: 10px;
		font-weight: bold;
	}

	.factory-button {
		background-color: rgba(250, 149, 73, 1);
		color: white;
		border: none;
		padding: 10px 15px;
		margin-right: 10px;
		border-radius: 5px;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border: 2px solid transparent; /* 투명한 border 추가 */
	}

	.factory-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.factory-button:active {
		transform: translateY(0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.factory-button.selected {
		border-color: rgba(255, 255, 255, 0.8); /* border 색상 변경 */
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	/* 전체 컨테이너 설정 */
	.container {
		display: flex;
		flex-direction: column;
		width: 100vw; /* 브라우저 전체 너비 */
		max-width: 100%;
	}

	/* Content 영역 스타일 */
	.content {
		display: flex;
		flex-direction: column; /* 위 아래로 정렬 */
		flex: 1; /* 남은 공간을 차지 */
		overflow: hidden; /* 불필요한 스크롤 제거 */
	}

	/* FactoryLines 스타일 */
	.factory-lines {
		flex: 1; /* 위쪽 영역이 차지할 비율 */
		overflow-y: auto; /* 세로 스크롤 활성화 */
		padding: 10px;
	}

	/* Deliveries 스타일 */
	.deliveries {
		flex: 1; /* 아래쪽 영역이 차지할 비율 */
		overflow-y: auto; /* 세로 스크롤 활성화 */
		padding: 10px;
	}
</style>
