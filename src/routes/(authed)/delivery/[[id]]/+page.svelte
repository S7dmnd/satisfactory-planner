<script lang="ts">
	let { data } = $props();
	const userId = data.userId;
	let factoryList = $state(data.factoryList);
	let recipeList = data.recipeList;

	let isEdit = $state(data.rowFrame.ROWID !== null);

	let factoryId = $state(data.rowFrame.FACTORYID);
	let recipeKey = $state(data.rowFrame.RECIPEKEY);
	let recipeFrame = $derived(recipeList.find((r) => r.RECIPEKEY === recipeKey));
	let lineAmount = $state(data.rowFrame.LINEAMOUNT);
	let todoAmount = $state(data.rowFrame.TODOAMOUNT);

	let searchText = $state('');
	let filteredRecipes = $derived.by(() => {
		if (!searchText || searchText.trim() === '') {
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
				inItems.some((item) => item?.toLowerCase().includes(searchText.toLowerCase())) ||
				outItems.some((item) => item?.toLowerCase().includes(searchText.toLowerCase()))
			);
		});
	});

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

	const handleTodoAmountChange = (e) => {
		let newTodoAmount = e.target.value;
		if (newTodoAmount > lineAmount) {
			alert(`Todo Amount ${newTodoAmount} must be equal or lower than Line Amount ${lineAmount}!`);
			todoAmount = lineAmount;
		} else {
			todoAmount = newTodoAmount;
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
						USERID: userId,
						FACTORYNAME: newFactoryName
					})
				});

				if (!response.ok) {
					throw new Error(`Failed to save newFactory: ${response.statusText}`);
				}

				const newFactoryID = (await response.json()).id;

				factoryList.push({ FACTORYID: newFactoryID, FACTORYNAME: newFactoryName });
				factoryId = newFactoryID;
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
	<select id="factory-select" bind:value={factoryId}>
		<option value={null} disabled hidden>-- Select a Factory --</option>
		{#each factoryList as factory}
			<option value={factory.FACTORYID} disabled={isEdit}>
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
	<select id="recipe-select" bind:value={recipeKey}>
		<option value={null} disabled hidden>-- Select a Recipe --</option>
		{#each filteredRecipes as recipe}
			<option value={recipe.RECIPEKEY} disabled={isEdit}>
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
		{#if recipeFrame?.INITEMNAME1}
			<tr>
				<td>IN</td>
				<td>{recipeFrame.INITEMNAME1}</td>
				<td>{recipeFrame.INAMOUNT1}</td>
				<td>{recipeFrame.INAMOUNT1 * lineAmount}</td>
			</tr>
		{/if}
		{#if recipeFrame?.INITEMNAME2}
			<tr>
				<td>IN</td>
				<td>{recipeFrame.INITEMNAME2}</td>
				<td>{recipeFrame.INAMOUNT2}</td>
				<td>{recipeFrame.INAMOUNT2 * lineAmount}</td>
			</tr>
		{/if}
		{#if recipeFrame?.INITEMNAME3}
			<tr>
				<td>IN</td>
				<td>{recipeFrame.INITEMNAME3}</td>
				<td>{recipeFrame.INAMOUNT3}</td>
				<td>{recipeFrame.INAMOUNT3 * lineAmount}</td>
			</tr>
		{/if}
		{#if recipeFrame?.INITEMNAME4}
			<tr>
				<td>IN</td>
				<td>{recipeFrame.INITEMNAME4}</td>
				<td>{recipeFrame.INAMOUNT4}</td>
				<td>{recipeFrame.INAMOUNT4 * lineAmount}</td>
			</tr>
		{/if}

		<!-- OUT ITEMS -->
		{#if recipeFrame?.OUTITEMNAME1}
			<tr>
				<td>OUT</td>
				<td>{recipeFrame.OUTITEMNAME1}</td>
				<td>{recipeFrame.OUTAMOUNT1}</td>
				<td>{recipeFrame.OUTAMOUNT1 * lineAmount}</td>
			</tr>
		{/if}
		{#if recipeFrame?.OUTITEMNAME2}
			<tr>
				<td>OUT</td>
				<td>{recipeFrame.OUTITEMNAME2}</td>
				<td>{recipeFrame.OUTAMOUNT2}</td>
				<td>{recipeFrame.OUTAMOUNT2 * lineAmount}</td>
			</tr>
		{/if}
	</tbody>
</table>

<!-- Row 데이터 입력 -->
<div class="row-form">
	<h3>Row Data</h3>
	<form method="POST">
		<div>
			<label for="lineamount">LINE AMOUNT:</label>
			<input id="lineamount" name="LINEAMOUNT" type="number" bind:value={lineAmount} />
		</div>
		<div>
			<label for="todoamount">TODO AMOUNT:</label>
			<input
				id="todoamount"
				type="number"
				name="TODOAMOUNT"
				bind:value={todoAmount}
				onchange={(e) => handleTodoAmountChange(e)}
			/>
		</div>

		<!-- Hidden inputs for additional data -->
		<input type="hidden" name="FACTORYID" value={factoryId} />
		<input type="hidden" name="RECIPEKEY" value={recipeKey} />
		<input type="hidden" name="EXTRAAMOUNT1" value="0" />
		<input type="hidden" name="EXTRAAMOUNT2" value="0" />
		<input type="hidden" name="USERID" value={userId} />

		<!-- Conditionally add ROWID if it's an edit -->
		{#if isEdit}
			<input type="hidden" name="ROWID" value={data.rowFrame.ROWID} />
		{/if}

		<button type="submit">Save Row</button>
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
