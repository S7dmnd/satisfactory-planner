<script lang="ts">
	import FactoryTodos from '$lib/components/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const userId = data.userId;
</script>

<div class="todo-page-container">
	{#each data.todos as factoryTodos}
		<FactoryTodos todos={factoryTodos} {userId} />
	{/each}
</div>
