<script lang="ts">
	import FactoryLines from '$lib/factory-line/FactoryLines.svelte';

	// let { data } = $props();
	let data = {
		factoryLines: [
			{
				FACTORYNAME: '본공장',
				lines: [
					{
						ROWID: 1,
						INITEMNAME1: '질산',
						INAMOUNT1: 12,
						INITEMNAME2: '질산',
						INAMOUNT2: 1.22,
						OUTITEMNAME1: '질산',
						OUTAMOUNT1: 43.2,
						LINEAMOUNT: 1,
						TODOAMOUNT: 0
					},
					{
						ROWID: 2,
						INITEMNAME1: '구리 주괴',
						INAMOUNT1: 2.44,
						INITEMNAME2: '구리 주괴',
						INAMOUNT2: 24,
						INITEMNAME3: '철 주괴',
						INAMOUNT3: 2.44,
						INITEMNAME4: '철 주괴',
						INAMOUNT4: 24,
						OUTITEMNAME1: '물',
						OUTAMOUNT1: 24,
						OUTITEMNAME2: '구리 주괴',
						OUTAMOUNT2: 43.2,
						LINEAMOUNT: 2,
						TODOAMOUNT: 2
					}
				]
			},
			{
				FACTORYNAME: '석유공장',
				lines: [
					{
						ROWID: 5,
						INITEMNAME1: '물',
						INAMOUNT1: 1,
						OUTITEMNAME1: '수소수',
						OUTAMOUNT1: 1,
						LINEAMOUNT: 1,
						TODOAMOUNT: 0
					}
				]
			}
		]
	};

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
	<FactoryLines lines={factoryLines} />
</div>
