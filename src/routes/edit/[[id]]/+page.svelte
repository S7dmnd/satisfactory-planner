<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();
	let rowFrame = data.rowFrame;
	let factoryList = $state(data.factoryList);
	let recipeList = data.recipeList;

	let recipeFrame = recipeList.find((r) => r.RECIPEKEY === rowFrame.RECIPEKEY) || '';
	let selectedFactory = $state(rowFrame.FACTORYID);
	let selectedRecipe = $state(rowFrame.FACTORYID);

	let searchText = $state('');
	let filteredRecipes = $derived(filterRecipes(searchText, recipeList));

	let row = $state({
		FACTORYID: rowFrame.FACTORYID,
		RECIPEKEY: rowFrame.RECIPEKEY,
		INITEMNAME1: recipeFrame.INITEMNAME1 || '',
		INAMOUNT1: recipeFrame.INAMOUNT1 || '',
		INITEMNAME2: recipeFrame.INITEMNAME2 || '',
		INAMOUNT2: recipeFrame.INAMOUNT2 || '',
		INITEMNAME3: recipeFrame.INITEMNAME3 || '',
		INAMOUNT3: recipeFrame.INAMOUNT3 || '',
		INITEMNAME4: recipeFrame.INITEMNAME4 || '',
		INAMOUNT4: recipeFrame.INAMOUNT4 || '',
		OUTITEMNAME1: recipeFrame.OUTITEMNAME1 || '',
		OUTAMOUNT1: recipeFrame.OUTAMOUNT1 || '',
		OUTITEMNAME2: recipeFrame.OUTITEMNAME2 || '',
		OUTAMOUNT2: recipeFrame.OUTAMOUNT2 || '',
		LINEAMOUNT: rowFrame.LINEAMOUNT || 0,
		TODOAMOUNT: rowFrame.TODOAMOUNT || 0
	});
	// [POST] /api/factory-line
	let output = $derived(convertRowToOutput());

	// 레시피 필터링
	function filterRecipes(text, recipeList) {
		if (!text || text.trim() === '') {
			// 검색어가 비어있으면 전체 레시피 반환
			return recipeList;
		}

		// 검색어와 일치하는 INITEMNAME 또는 OUTITEMNAME이 있는 레시피 필터링
		return recipeList.filter((recipe) => {
			// INITEMNAME(1~4)과 OUTITEMNAME(1~2) 모두를 검사
			const inItems = [
				recipe.INITEMNAME1,
				recipe.INITEMNAME2,
				recipe.INITEMNAME3,
				recipe.INITEMNAME4
			];
			const outItems = [recipe.OUTITEMNAME1, recipe.OUTITEMNAME2];

			// 검색어가 INITEMNAME이나 OUTITEMNAME에 포함되어 있는지 확인
			return (
				inItems.some((item) => item?.toLowerCase().includes(text.toLowerCase())) ||
				outItems.some((item) => item?.toLowerCase().includes(text.toLowerCase()))
			);
		});
	}

	// Row 데이터를 업데이트하는 함수
	function updateRowWithRecipe(recipe) {
		// row의 RECIPEKEY와 기타 필드를 업데이트
		row.RECIPEKEY = recipe.RECIPEKEY;
		row.INITEMNAME1 = recipe.INITEMNAME1 || '';
		row.INITEMNAME2 = recipe.INITEMNAME2 || '';
		row.INITEMNAME3 = recipe.INITEMNAME3 || '';
		row.INITEMNAME4 = recipe.INITEMNAME4 || '';
		row.OUTITEMNAME1 = recipe.OUTITEMNAME1 || '';
		row.OUTITEMNAME2 = recipe.OUTITEMNAME2 || '';
		row.INAMOUNT1 = recipe.INAMOUNT1 || '';
		row.INAMOUNT2 = recipe.INAMOUNT2 || '';
		row.INAMOUNT3 = recipe.INAMOUNT3 || '';
		row.INAMOUNT4 = recipe.INAMOUNT4 || '';
		row.OUTAMOUNT1 = recipe.OUTAMOUNT1 || '';
		row.OUTAMOUNT2 = recipe.OUTAMOUNT2 || '';
		console.log('Updated row:', row);
	}

	function calculateAmount(amount) {
		return amount * row.LINEAMOUNT;
	}

	// Row 데이터 저장 처리
	async function saveRow() {
		if (!output.FACTORYID || !output.RECIPEKEY) {
			alert('Error: FACTORYID or RECIPEKEY is missing.');
			alert(`FACTORYID = ${output.FACTORYID}, RECIPEKEY = ${output.RECIPEKEY}`);
			return;
		}

		try {
			const response = await fetch('/api/factory-line', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(output)
			});

			if (!response.ok) {
				throw new Error(`Failed to save row: ${response.statusText}`);
			}

			// 4. 성공 시 리다이렉트
			alert('Row saved successfully!');
			goto('/todo');
		} catch (error) {
			console.error('Error saving row:', error);
			alert(`Failed to save row: ${error.message}`);
		}
	}

	async function updateRow() {
		if (!output.FACTORYID || !output.RECIPEKEY) {
			alert('Error: FACTORYID or RECIPEKEY is missing.');
			alert(`FACTORYID = ${output.FACTORYID}, RECIPEKEY = ${output.RECIPEKEY}`);
			return;
		}

		try {
			const response = await fetch(`/api/factory-line/${rowFrame.ROWID}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(output)
			});

			if (!response.ok) {
				throw new Error(`Failed to save row: ${response.statusText}`);
			}

			// 4. 성공 시 리다이렉트
			alert('Row updated successfully!');
			goto('/todo');
		} catch (error) {
			console.error('Error updating row:', error);
			alert(`Failed to update row ${rowFrame.ROWID}: ${error.message}`);
		}
	}

	function handleRowAction() {
		if (rowFrame.ROWID) {
			updateRow(); // ROWID가 있으면 업데이트
		} else {
			saveRow(); // ROWID가 없으면 저장
		}
	}

	function formatRecipeText(recipe) {
		// IN 아이템 텍스트 구성
		const inItems = [];
		if (recipe.INITEMNAME1) inItems.push(`${recipe.INITEMNAME1} * ${recipe.INAMOUNT1}`);
		if (recipe.INITEMNAME2) inItems.push(`${recipe.INITEMNAME2} * ${recipe.INAMOUNT2}`);
		if (recipe.INITEMNAME3) inItems.push(`${recipe.INITEMNAME3} * ${recipe.INAMOUNT3}`);
		if (recipe.INITEMNAME4) inItems.push(`${recipe.INITEMNAME4} * ${recipe.INAMOUNT4}`);

		// OUT 아이템 텍스트 구성
		const outItems = [];
		if (recipe.OUTITEMNAME1) outItems.push(`${recipe.OUTITEMNAME1} * ${recipe.OUTAMOUNT1}`);
		if (recipe.OUTITEMNAME2) outItems.push(`${recipe.OUTITEMNAME2} * ${recipe.OUTAMOUNT2}`);

		// 텍스트를 "(INITEM) --> (OUTITEM)" 형식으로 반환
		return `${inItems.join(' + ')} --> ${outItems.join(' + ')}`;
	}

	function convertRowToOutput() {
		const output = {
			FACTORYID: row.FACTORYID,
			RECIPEKEY: row.RECIPEKEY,
			LINEAMOUNT: row.LINEAMOUNT,
			TODOAMOUNT: row.TODOAMOUNT,
			EXTRAAMOUNT1: 0,
			EXTRAAMOUNT2: 0
		};
		return output;
	}

	const handleSelectFactory = (e) => {
		selectedFactory = e.target.value;
		row.FACTORYID = selectedFactory;
		//alert(row.FACTORYID);
	};

	const handleSelectRecipe = (e) => {
		selectedRecipe = e.target.value; // 선택된 RECIPEKEY
		const recipe = recipeList.find((r) => r.RECIPEKEY === selectedRecipe);

		if (recipe) {
			updateRowWithRecipe(recipe); // Row 업데이트
		} else {
			console.error(`Recipe with RECIPEKEY ${selectedRecipe} not found.`);
		}
	};

	const handleTodoAmountChange = (e) => {
		let todoAmount = e.target.value;
		if (todoAmount > row.LINEAMOUNT) {
			alert(`Todo Amount ${todoAmount} must be equal or lower than Line Amount ${row.LINEAMOUNT}!`);
			e.target.value = row.LINEAMOUNT;
		} else {
			row.TODOAMOUNT = todoAmount;
		}
	};

	const addNewFactory = async () => {
		const newFactoryName = prompt('Enter the name of the new factory:');
		if (newFactoryName) {
			try {
				const response = await fetch('/api/factory-list', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						FACTORYNAME: newFactoryName
					})
				});

				if (!response.ok) {
					throw new Error(`Failed to save newFactory: ${response.statusText}`);
				}

				const newFactoryID = (await response.json()).id;

				factoryList = [...factoryList, { FACTORYID: newFactoryID, FACTORYNAME: newFactoryName }];
				row.FACTORYID = newFactoryID;
				selectedFactory = newFactoryID;
			} catch (error) {
				console.error('Error saving newFactory:', error);
				alert(`Failed to save row: ${error.message}`);
			}
		}
	};
</script>

<!-- 공장 선택 드롭다운 -->
<div class="dropdown">
	<label for="factory-select">Select Factory:</label>
	<select id="factory-select" onchange={handleSelectFactory}>
		<!-- 첫 번째 옵션 설정 -->
		{#if rowFrame.FACTORYID}
			<option value={row.FACTORYID}>
				{factoryList.find((factory) => factory.FACTORYID === row.FACTORYID)?.FACTORYNAME ||
					'Unknown Factory'}
			</option>
		{:else}
			<option value="">-- Select a Factory --</option>
		{/if}

		<!-- 나머지 옵션 비활성화 -->
		{#each factoryList as factory}
			<option value={factory.FACTORYID} disabled={rowFrame.FACTORYID}>
				{factory.FACTORYNAME}
			</option>
		{/each}
	</select>
	<button type="button" onclick={addNewFactory}>Add New Factory</button>
</div>

<!-- 레시피 선택 드롭다운 및 검색창 -->

<div class="search-bar">
	<input
		type="text"
		placeholder="Search recipes by INITEMNAME or OUTITEMNAME"
		bind:value={searchText}
	/>
</div>

<div class="dropdown">
	<label for="recipe-select">Select Recipe:</label>
	<select id="recipe-select" onchange={handleSelectRecipe}>
		<!-- 첫 번째 옵션 동적 설정 -->
		{#if rowFrame.RECIPEKEY}
			<option value={rowFrame.RECIPEKEY}>
				{formatRecipeText(
					filteredRecipes.find((recipe) => recipe.RECIPEKEY == rowFrame.RECIPEKEY)
				) || 'Unknown Recipe'}
			</option>
		{:else}
			<option value="">-- Select a Recipe --</option>
		{/if}

		<!-- 나머지 옵션 비활성화 -->
		{#each filteredRecipes as recipe}
			<option value={recipe.RECIPEKEY} disabled={rowFrame.RECIPEKEY}>
				{formatRecipeText(recipe)}
			</option>
		{/each}
	</select>
</div>

<h3>Input & Output Items</h3>
<table class="io-table">
	<thead>
		<tr>
			<th>Type</th>
			<th>Name</th>
			<th>Amount</th>
			<th>Calculated Amount</th>
		</tr>
	</thead>
	<tbody>
		<!-- IN ITEMS -->
		{#if row.INITEMNAME1}
			<tr>
				<td>IN</td>
				<td>{row.INITEMNAME1}</td>
				<td>{row.INAMOUNT1}</td>
				<td>{calculateAmount(row.INAMOUNT1)}</td>
			</tr>
		{/if}
		{#if row.INITEMNAME2}
			<tr>
				<td>IN</td>
				<td>{row.INITEMNAME2}</td>
				<td>{row.INAMOUNT2}</td>
				<td>{calculateAmount(row.INAMOUNT2)}</td>
			</tr>
		{/if}
		{#if row.INITEMNAME3}
			<tr>
				<td>IN</td>
				<td>{row.INITEMNAME3}</td>
				<td>{row.INAMOUNT3}</td>
				<td>{calculateAmount(row.INAMOUNT3)}</td>
			</tr>
		{/if}
		{#if row.INITEMNAME4}
			<tr>
				<td>IN</td>
				<td>{row.INITEMNAME4}</td>
				<td>{row.INAMOUNT4}</td>
				<td>{calculateAmount(row.INAMOUNT4)}</td>
			</tr>
		{/if}

		<!-- OUT ITEMS -->
		{#if row.OUTITEMNAME1}
			<tr>
				<td>OUT</td>
				<td>{row.OUTITEMNAME1}</td>
				<td>{row.OUTAMOUNT1}</td>
				<td>{calculateAmount(row.OUTAMOUNT1)}</td>
			</tr>
		{/if}
		{#if row.OUTITEMNAME2}
			<tr>
				<td>OUT</td>
				<td>{row.OUTITEMNAME2}</td>
				<td>{row.OUTAMOUNT2}</td>
				<td>{calculateAmount(row.OUTAMOUNT2)}</td>
			</tr>
		{/if}
	</tbody>
</table>

<!-- Row 데이터 입력 -->
<div class="row-form">
	<h3>Row Data</h3>
	<form>
		<div>
			<label for="lineamount">LINE AMOUNT:</label>
			<input id="lineamount" type="number" bind:value={row.LINEAMOUNT} />
		</div>
		<div>
			<label for="todoamount">TODO AMOUNT:</label>
			<input
				id="todoamount"
				type="number"
				value={rowFrame.TODOAMOUNT || 0}
				onchange={(e) => handleTodoAmountChange(e)}
			/>
		</div>
		<button type="button" onclick={handleRowAction}>Save Row</button>
	</form>
</div>

<style>
	h3 {
		text-align: center;
		color: rgba(250, 149, 73, 255);
		margin-top: 20px;
	}

	/* Dropdown Styling */
	.dropdown {
		margin: 20px auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.dropdown label {
		margin-bottom: 5px;
		font-weight: bold;
	}

	.dropdown select {
		padding: 10px;
		font-size: 1rem;
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		border: 1px solid rgba(250, 149, 73, 255);
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.dropdown select:hover {
		background-color: rgba(250, 149, 73, 0.3);
	}

	/* Search Bar Styling */
	.search-bar {
		display: flex;
		justify-content: center;
		margin: 20px;
	}

	.search-bar input {
		padding: 10px;
		width: 50%;
		font-size: 1rem;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
	}

	.search-bar input::placeholder {
		color: rgba(14, 14, 14, 0.7);
	}

	/* Row Form Styling */
	.row-form {
		margin: 20px;
		padding: 20px;
		border-radius: 10px;
		background-color: rgba(14, 14, 14, 255);
		border: 1px solid rgba(250, 149, 73, 255);
	}

	.row-form h3 {
		color: rgba(250, 149, 73, 255);
		text-align: center;
		margin-bottom: 20px;
	}

	.row-form form {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.row-form label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	.row-form input[type='text'],
	.row-form input[type='number'] {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		width: calc(100% - 22px);
	}

	/* Save Button Styling */
	button {
		padding: 10px;
		background-color: rgba(250, 149, 73, 255);
		color: white;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		border-radius: 5px;
		transition: background-color 0.3s ease;
		align-self: center;
	}

	button:hover {
		background-color: rgba(250, 149, 73, 0.8);
	}

	button:active {
		transform: scale(0.98);
	}

	/* Responsive Styling */
	@media (max-width: 768px) {
		.search-bar input {
			width: 80%;
		}

		.row-form {
			padding: 15px;
		}

		.dropdown select {
			width: 80%;
		}
	}

	/* Input & Output Items Table Styling */
	.io-table {
		width: 80%;
		margin: 20px auto;
		border-collapse: collapse;
		background-color: rgba(14, 14, 14, 255);
		border: 1px solid rgba(250, 149, 73, 255);
		color: white;
	}

	.io-table thead {
		background-color: rgba(250, 149, 73, 255);
		color: black;
	}

	.io-table th,
	.io-table td {
		border: 1px solid rgba(250, 149, 73, 255);
		padding: 10px;
		text-align: center;
	}

	.io-table tbody tr:nth-child(even) {
		background-color: rgba(250, 149, 73, 0.1);
	}

	.io-table tbody tr:hover {
		background-color: rgba(250, 149, 73, 0.2);
	}

	/* Responsive Styling */
	@media (max-width: 768px) {
		.search-bar input {
			width: 80%;
		}

		.row-form {
			padding: 15px;
		}

		.dropdown select {
			width: 80%;
		}

		.io-table {
			width: 100%;
		}
	}
</style>
