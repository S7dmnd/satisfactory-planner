<script lang="ts">
	import FactoryLines from '$lib/factory-line/FactoryLines.svelte';

	let { data } = $props();

	let chosenFactory = $state('');
	let factoryLines = $derived(getLinesByFactory(chosenFactory));

	function getLinesByFactory(chosenFactory) {
		if (chosenFactory === '') {
			return data.factoryLines.flatMap((factory) => factory.lines);
		} else {
			const factory = data.factoryLines.find((factory) => factory.FACTORYNAME === chosenFactory);
			return factory ? factory.lines : [];
		}
	}
</script>

<div>
	<div>
		<button
			onclick={() => {
				chosenFactory = '';
			}}>전체</button
		>
		{#each data.factoryLines as factories}
			<button
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
			<a href="/edit">+</a>
			<FactoryLines lines={factoryLines} />
		</div>
		<!-- Delivery div -->
		<div></div>
	</div>
</div>
