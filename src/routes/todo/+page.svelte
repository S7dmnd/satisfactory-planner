<script lang="ts">
	import FactoryTodos from '$lib/todo/FactoryTodos.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let checkedTodoList = $state([]);

	const handleSave = async () => {
		//alert(`Checked TODOs: ${JSON.stringify({ checkedTodoList })}`);

		try {
			const response = await fetch('/api/todo', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ checkedTodoList })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Unknown error');
			}

			console.log(data.message);
		} catch (error) {
			console.error('Error updating TODOAMOUNT:', error);
		}
		window.location.reload();
	};
</script>

<div class="todo-page-container">
	<h1>TODOS</h1>
	<button onclick={handleSave} class="todo-save-button"> Save </button>
	{#each data.todos as factoryTodos}
		<FactoryTodos todos={factoryTodos} {checkedTodoList} />
	{/each}
</div>

<style>
	/* Button Styling */

	.todo-save-button {
		background-color: rgba(250, 149, 73, 255);
		color: white;
		border: none;
		padding: 10px 20px;
		cursor: pointer;
		font-size: 1rem;
		border-radius: 5px;
		transition: background-color 0.3s ease;
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.todo-save-button:hover {
		background-color: rgba(250, 149, 73, 0.8);
	}

	.todo-save-button:active {
		transform: scale(0.98);
	}
</style>
