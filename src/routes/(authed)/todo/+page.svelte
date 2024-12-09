<script lang="ts">
	import FactoryTodos from '$lib/components/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';

	let { data }: { data: PageData } = $props();
	let ready = $state(false);

	const userId = data.userId;
	onMount(() => {
		ready = true;
	});
</script>

<div class="todo-page-container">
	{#if !ready}
		<Loading message="Loading..." />
	{/if}
	{#each data.todos as factoryTodos}
		<FactoryTodos todos={factoryTodos} />
	{/each}
</div>
