<script lang="ts">
	let { factoryList } = $props();

	// const response = await fetch('/api/todos');
	// const todos = await response.json();
	let todos = $state([
		{
			id: 1,
			inItem1: '철 주괴',
			inAmount1: 420,
			outItem1: '철판',
			outAmount1: 280,
			count: 14
		},
		{
			id: 2,
			inItem1: '자동 배선기',
			inAmount1: 5,
			inItem2: '회로 기판',
			inAmount2: 5,
			inItem3: '고중량 모듈식 골조',
			inAmount3: 1,
			inItem4: '컴퓨터',
			inAmount4: 2,
			outItem1: '적응형 제어 장치',
			outAmount1: 1,
			count: 1
		},
		{
			id: 3,
			inItem1: '포장된 질소 가스',
			inAmount1: 60,
			outItem1: '질소 가스',
			outAmount1: 240,
			outItem2: '빈 통',
			outAmount2: 60,
			count: 2
		}
	]);
	let checkedTodoList = $state([]);

	const handleSave = () => {
		alert(`${checkedTodoList}`);
		//이제 여기서 checkedTodoList DELETE API fetch하고 todos 다시 fetch 해오면 됨 ㅇㅇ
	};

</script>
<button onclick={handleSave}>
	Save
</button>
{#each factoryList as factoryName}
	<div>
		<h3>{factoryName}</h3>
		<table>
			<thead>
				<tr>
					<th></th>
					<th>In 1</th>
					<th>In 2</th>
					<th>In 3</th>
					<th>In 4</th>
					<th>Out 1</th>
					<th>Out 2</th>
					<th>Count</th>
				</tr>
			</thead>
			<tbody>
				{#each todos as todo}
					<tr>
						<td>
							<input
								type="checkbox"
								onclick={() => {
									if (checkedTodoList.includes(todo.id)) {
										checkedTodoList = checkedTodoList.filter((id) => id !== todo.id);
									}
									else {
										checkedTodoList.push(todo.id);
									}}}
							/>
						</td>
						<td>{todo.inItem1} {todo.inAmount1}</td>
						<td>{todo.inItem2} {todo.inAmount2}</td>
						<td>{todo.inItem3} {todo.inAmount3}</td>
						<td>{todo.inItem4} {todo.inAmount4}</td>
						<td>{todo.outItem1} {todo.outAmount1}</td>
						<td>{todo.outItem2} {todo.outAmount2}</td>
						<td>{todo.count}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/each}
