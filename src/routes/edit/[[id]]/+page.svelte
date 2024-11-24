<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();
	let factoryList = data.factoryList;
	let receiptList = data.receiptList;

	let selectedFactory = $state(null);
	let selectedReceipt = $state(null);

	let searchText = $state('');
	let filteredReceipts = $derived(filterReceipts(searchText, receiptList));

	let row = $state({
		FACTORYID: '',
		RECEIPTID: '',
		INITEMNAME1: '',
		INAMOUNT1: '',
		INITEMNAME2: '',
		INAMOUNT2: '',
		INITEMNAME3: '',
		INAMOUNT3: '',
		INITEMNAME4: '',
		INAMOUNT4: '',
		OUTITEMNAME1: '',
		OUTAMOUNT1: '',
		OUTITEMNAME2: '',
		OUTAMOUNT2: '',
		LINEAMOUNT: 0,
		TODOAMOUNT: 0
	});
	// [POST] /api/factory-line
	let output = $derived(convertRowToOutput());

	// 레시피 필터링
	function filterReceipts(text, receiptList) {
		if (!text || text.trim() === '') {
			// 검색어가 비어있으면 전체 레시피 반환
			return receiptList;
		}

		// 검색어와 일치하는 INITEMNAME 또는 OUTITEMNAME이 있는 레시피 필터링
		return receiptList.filter((receipt) => {
			// INITEMNAME(1~4)과 OUTITEMNAME(1~2) 모두를 검사
			const inItems = [
				receipt.INITEMNAME1,
				receipt.INITEMNAME2,
				receipt.INITEMNAME3,
				receipt.INITEMNAME4
			];
			const outItems = [receipt.OUTITEMNAME1, receipt.OUTITEMNAME2];

			// 검색어가 INITEMNAME이나 OUTITEMNAME에 포함되어 있는지 확인
			return (
				inItems.some((item) => item?.toLowerCase().includes(text.toLowerCase())) ||
				outItems.some((item) => item?.toLowerCase().includes(text.toLowerCase()))
			);
		});
	}

	// Row 데이터를 업데이트하는 함수
	function updateRowWithReceipt(receipt) {
		// row의 RECEIPTID와 기타 필드를 업데이트
		row.RECEIPTID = receipt.RECEIPTID;
		row.INITEMNAME1 = receipt.INITEMNAME1 || '';
		row.INITEMNAME2 = receipt.INITEMNAME2 || '';
		row.INITEMNAME3 = receipt.INITEMNAME3 || '';
		row.INITEMNAME4 = receipt.INITEMNAME4 || '';
		row.OUTITEMNAME1 = receipt.OUTITEMNAME1 || '';
		row.OUTITEMNAME2 = receipt.OUTITEMNAME2 || '';
		row.INAMOUNT1 = receipt.INAMOUNT1 || '';
		row.INAMOUNT2 = receipt.INAMOUNT2 || '';
		row.INAMOUNT3 = receipt.INAMOUNT3 || '';
		row.INAMOUNT4 = receipt.INAMOUNT4 || '';
		row.OUTAMOUNT1 = receipt.OUTAMOUNT1 || '';
		row.OUTAMOUNT2 = receipt.OUTAMOUNT2 || '';
		console.log('Updated row:', row);
	}

	function calculateAmount(amount) {
		return amount * row.LINEAMOUNT;
	}

	// Row 데이터 저장 처리
	async function saveRow() {
		if (!output.FACTORYID || !output.RECEIPTID) {
			alert('Error: FACTORYID or RECEIPTID is missing.');
			alert(`FACTORYID = ${output.FACTORYID}, RECEIPTID = ${output.RECEIPTID}`);
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

	function formatReceiptText(receipt) {
		// IN 아이템 텍스트 구성
		const inItems = [];
		if (receipt.INITEMNAME1) inItems.push(`${receipt.INITEMNAME1} * ${receipt.INAMOUNT1}`);
		if (receipt.INITEMNAME2) inItems.push(`${receipt.INITEMNAME2} * ${receipt.INAMOUNT2}`);
		if (receipt.INITEMNAME3) inItems.push(`${receipt.INITEMNAME3} * ${receipt.INAMOUNT3}`);
		if (receipt.INITEMNAME4) inItems.push(`${receipt.INITEMNAME4} * ${receipt.INAMOUNT4}`);

		// OUT 아이템 텍스트 구성
		const outItems = [];
		if (receipt.OUTITEMNAME1) outItems.push(`${receipt.OUTITEMNAME1} * ${receipt.OUTAMOUNT1}`);
		if (receipt.OUTITEMNAME2) outItems.push(`${receipt.OUTITEMNAME2} * ${receipt.OUTAMOUNT2}`);

		// 텍스트를 "(INITEM) --> (OUTITEM)" 형식으로 반환
		return `${inItems.join(' + ')} --> ${outItems.join(' + ')}`;
	}

	function convertRowToOutput() {
		const output = {
			FACTORYID: row.FACTORYID,
			RECEIPTID: row.RECEIPTID,
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

	const handleSelectReceipt = (e) => {
		selectedReceipt = parseInt(e.target.value); // 선택된 RECEIPTID
		const receipt = receiptList.find((r) => r.RECEIPTID === selectedReceipt);

		if (receipt) {
			updateRowWithReceipt(receipt); // Row 업데이트
		} else {
			console.error(`Receipt with RECEIPTID ${selectedReceipt} not found.`);
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
</script>

<h1>Factory and Recipe Management</h1>

<!-- 공장 선택 드롭다운 -->
<div class="dropdown">
	<label for="factory-select">Select Factory:</label>
	<select id="factory-select" onchange={handleSelectFactory}>
		<option value="">-- Select a Factory --</option>
		{#each factoryList as factory}
			<option value={factory.FACTORYID}>{factory.FACTORYNAME}</option>
		{/each}
	</select>
</div>

<!-- 레시피 선택 드롭다운 및 검색창 -->

<div class="search-bar">
	<input
		type="text"
		placeholder="Search receipts by INITEMNAME or OUTITEMNAME"
		bind:value={searchText}
	/>
</div>

<div class="dropdown">
	<label for="receipt-select">Select Recipe:</label>
	<select id="receipt-select" onchange={handleSelectReceipt}>
		<option value="">-- Select a Recipe --</option>
		{#each filteredReceipts as receipt}
			<option value={receipt.RECEIPTID}>
				{formatReceiptText(receipt)}
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
			<input id="todoamount" type="number" value="0" onchange={(e) => handleTodoAmountChange(e)} />
		</div>
		<button type="button" onclick={saveRow}>Save Row</button>
	</form>
</div>

<style>
	h1,
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
	.row-form button {
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

	.row-form button:hover {
		background-color: rgba(250, 149, 73, 0.8);
	}

	.row-form button:active {
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
