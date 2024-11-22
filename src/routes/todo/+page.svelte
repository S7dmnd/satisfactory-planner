<script lang="ts">
	import FactoryTodos from '$lib/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	//console.log(data.todos);
</script>

{#if data.error}
	<p>Error: {data.error}</p>
{/if}

<div class=todo-page-container>
	<FactoryTodos todos={data.todos} />
</div>

