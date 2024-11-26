<script lang="ts">
	import FactoryLines from '$lib/factory-line/FactoryLines.svelte';

	let { data } = $props();

	let chosenFactory = $state('');
	let factoryLines = $derived.by(() => {
		if (chosenFactory === '') {
			return data.factoryLines.flatMap((factory) => factory.lines);
		} else {
			const factory = data.factoryLines.find((factory) => factory.FACTORYNAME === chosenFactory);
			return factory ? factory.lines : [];
		}
	});
</script>

<div>
	<div class="factories-container">
		<div class="factories-container-text">Factories:</div>
		<button
			class="factory-button"
			onclick={() => {
				chosenFactory = '';
			}}>전체</button
		>
		{#each data.factoryLines as factories}
			<button
				class="factory-button"
				onclick={() => {
					chosenFactory = factories.FACTORYNAME;
				}}>{factories.FACTORYNAME}</button
			>
		{/each}
	</div>
	<!--Item List div-->
	<div></div>
	<div>
		<!-- div for align-->
		<div>
			<!-- FactoryLine div -->
			<FactoryLines lines={factoryLines} />
		</div>
		<!-- Delivery div -->
		<div></div>
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
		background-color: rgba(250, 149, 73, 255);
		color: white;
		border: none;
		padding: 10px 15px;
		margin-right: 10px;
		border-radius: 5px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	.factory-button:hover {
		background-color: rgba(250, 149, 73, 0.8);
		transform: translateY(-2px);
	}

	.factory-button:active {
		transform: scale(0.98);
	}
</style>
