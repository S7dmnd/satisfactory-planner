<script lang="ts">
	import FactoryTodos from '$lib/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Todos</h1>

<FactoryTodos factoryList={data.factoryList} />

