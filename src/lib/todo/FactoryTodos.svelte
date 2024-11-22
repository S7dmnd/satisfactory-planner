<script lang="ts">
	let { todos } = $props();
	let checkedTodoList = $state([]);

	const handleSave = () => {
		alert(`Checked TODOs: ${checkedTodoList.join(', ')}`);
		// 체크된 항목들에 대한 처리 로직 추가
	};
</script>

<button onclick={handleSave} class="todo-save-button"> Save </button>

<div class="factory-container">
	<h3 class="factory-title">{todos.FACTORYNAME}</h3>
	<table class="todo-table">
		<thead class="todo-table-header">
			<tr>
				<th class="checkbox-column"></th>
				<th class="input-column">In 1</th>
				<th class="input-column">In 2</th>
				<th class="input-column">In 3</th>
				<th class="input-column">In 4</th>
				<th class="output-column">Out 1</th>
				<th class="output-column">Out 2</th>
				<th class="count-column">Count</th>
			</tr>
		</thead>
		<tbody class="todo-table-body">
			{#each todos.todos as todo}
				<tr class="todo-row">
					<td class="checkbox-cell">
						<input
							type="checkbox"
							class="todo-checkbox"
							onclick={() => {
								if (checkedTodoList.includes(todo.ROWID)) {
									checkedTodoList = checkedTodoList.filter((ROWID) => ROWID !== todo.ROWID);
								} else {
									checkedTodoList.push(todo.ROWID);
								}
							}}
						/>
					</td>
					<td class="input-cell">{todo.INITEMNAME1} {todo.INAMOUNT1}</td>
					<td class="input-cell">{todo.INITEMNAME2} {todo.INAMOUNT2}</td>
					<td class="input-cell">{todo.INITEMNAME3} {todo.INAMOUNT3}</td>
					<td class="input-cell">{todo.INITEMNAME4} {todo.INAMOUNT4}</td>
					<td class="output-cell">{todo.OUTITEMNAME1} {todo.OUTAMOUNT1}</td>
					<td class="output-cell">{todo.OUTITEMNAME2} {todo.OUTAMOUNT2}</td>
					<td class="count-cell">{todo.TODOAMOUNT}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
