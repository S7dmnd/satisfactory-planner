<script lang="ts">
	import FactoryTodos from '$lib/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="todo-page-container">
	<h1>TODOS</h1>
	{#each data.todos as factoryTodos}
		<FactoryTodos todos={factoryTodos} />
	{/each}
</div>
