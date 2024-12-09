<script lang="ts">
	let { data, form } = $props();
	const userId = data.userId;
	let factoryList = $state(data.factoryList);
	let itemList = data.itemList;

	let isEdit = $state(data.rowFrame.DELIVERYID !== null);

	let deliveryId = $state(data.rowFrame.DELIVERYID);
	let sourceId = $state(data.rowFrame.SOURCEID);
	let destinationId = $state(data.rowFrame.DESTINATIONID);
	let method = $state(data.rowFrame.METHOD);
	let amount = $state(data.rowFrame.AMOUNT);
	let itemKey = $state(data.rowFrame.ITEMKEY);
	let itemFrame = $derived(itemList.find((r) => r.ITEMKEY === itemKey));

	let searchText = $state('');
	let filteredItems = $derived.by(() => {
		if (!searchText || searchText.trim() === '') {
			// 검색어가 비어있으면 전체 레시피 반환
			return itemList;
		}

		return itemList.filter((item) => {
			const itemName = [item.KO, item.EN];
			return itemName.some((item) => item?.toLowerCase().includes(searchText.toLowerCase()));
		});
	});

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
			} catch (error) {
				console.error('Error saving newFactory:', error);
				alert(`Failed to save row: ${error.message}`);
			}
		}
	};
</script>

<div class="factory-select-container">
	<div class="dropdown-container">
		<!-- SOURCE 공장 선택 드롭다운 -->
		<div class="dropdown">
			<label for="source-select">Select Source Factory:</label>
			<select id="source-select" bind:value={sourceId}>
				<option value={null} disabled hidden>-- Select a Source Factory --</option>
				{#each factoryList as factory}
					<option value={factory.FACTORYID}>
						{factory.FACTORYNAME}
					</option>
				{/each}
			</select>
		</div>

		<button
			onclick={() => {
				[sourceId, destinationId] = [destinationId, sourceId];
			}}>⇄</button
		>

		<!-- DESTINATION 공장 선택 드롭다운 -->
		<div class="dropdown">
			<label for="destination-select">Select Destination Factory:</label>
			<select id="destination-select" bind:value={destinationId}>
				<option value={null} disabled hidden>-- Select a Destination Factory --</option>
				{#each factoryList as factory}
					<option value={factory.FACTORYID}>
						{factory.FACTORYNAME}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<button type="button" onclick={addNewFactory}>Add New Factory</button>
</div>

<!-- 아이템 선택 드롭다운 및 검색창 -->
<div class="dropdown">
	<label for="item-select">Select Item:</label>
	<input type="text" placeholder="Search items by KO or EN name" bind:value={searchText} />
	<select id="item-select" bind:value={itemKey}>
		<option value={null} disabled hidden>-- Select an Item --</option>
		{#each filteredItems as item}
			<option value={item.ITEMKEY}>
				{item.KO} ({item.EN})
			</option>
		{/each}
	</select>
</div>

<!-- 현재 선택된 Delivery 관련 정보 테이블 -->
<table class="io-table">
	<thead>
		<tr>
			<th>Source Factory</th>
			<th>Destination Factory</th>
			<th>Item (KO)</th>
			<th>Amount</th>
			<th>Method</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>{factoryList.find((f) => f.FACTORYID === sourceId)?.FACTORYNAME || 'N/A'}</td>
			<td>{factoryList.find((f) => f.FACTORYID === destinationId)?.FACTORYNAME || 'N/A'}</td>
			<td>{itemFrame?.KO || 'N/A'}</td>
			<td>
				<input type="number" bind:value={amount} min="0" />
			</td>
			<td>
				<input type="text" bind:value={method} />
			</td>
		</tr>
	</tbody>
</table>

<!-- Delivery 추가/수정 폼 -->
<form method="POST" class="row-form">
	<input type="hidden" name="USERID" value={userId} />
	<input type="hidden" name="SOURCEID" value={sourceId} />
	<input type="hidden" name="DESTINATIONID" value={destinationId} />
	<input type="hidden" name="ITEMKEY" value={itemKey} />
	<input type="hidden" name="AMOUNT" value={amount} />
	<input type="hidden" name="METHOD" value={method} />

	{#if isEdit}
		<input type="hidden" name="DELIVERYID" value={deliveryId} />
	{/if}

	{#if form?.error}
		<p style="color: red;">{form.error}</p>
	{/if}
	<button type="submit">{isEdit ? 'Update Delivery' : 'Add Delivery'}</button>
</form>

<style>
	.factory-select-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.dropdown-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}

	/* Dropdown Styling */
	.dropdown {
		margin: 20px auto;
		display: flex;
		gap: 20px;
		flex-direction: column;
		align-items: center;
	}

	.dropdown label {
		font-weight: bold;
		color: white;
	}

	.dropdown input {
		padding: 10px;
		width: 50%;
		font-size: 1rem;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 1);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
	}

	.dropdown input::placeholder {
		color: rgba(14, 14, 14, 0.7);
	}

	.dropdown select {
		padding: 10px;
		font-size: 1rem;
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		border: 1px solid rgba(250, 149, 73, 1);
		border-radius: 5px;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.dropdown select:hover {
		background-color: rgba(250, 149, 73, 0.3);
		box-shadow: 0 0 5px rgba(250, 149, 73, 1);
	}

	/* Row Form Styling */
	.row-form {
		margin: 20px;
		padding: 20px;
		border-radius: 10px;
		background-color: rgba(14, 14, 14, 1);
		color: black;
		display: flex; /* 추가 */
		flex-direction: column; /* 추가 */
		align-items: center; /* 추가 */
	}

	.io-table input[type='text'],
	.io-table input[type='number'] {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 1);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		width: 100%;
	}

	.io-table input[type='text']::placeholder,
	.io-table input[type='number']::placeholder {
		color: rgba(14, 14, 14, 0.7);
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
		width: auto; /* 버튼 폭 자동 설정 */
	}

	button:hover {
		background-color: rgba(250, 149, 73, 0.8);
	}

	button:active {
		transform: scale(0.98);
	}

	/* Input & Output Items Table Styling */
	.io-table {
		width: 80%;
		margin: 20px auto;
		border-collapse: collapse;
		background-color: rgba(14, 14, 14, 1);
		border: 1px solid rgba(250, 149, 73, 1);
		color: white;
	}

	.io-table thead {
		background-color: rgba(250, 149, 73, 1);
		color: black;
	}

	.io-table th,
	.io-table td {
		border: 1px solid rgba(250, 149, 73, 1);
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
		.row-form {
			padding: 15px;
		}

		.dropdown input,
		.dropdown select {
			width: 80%;
		}

		.io-table {
			width: 100%;
		}
	}
</style>
