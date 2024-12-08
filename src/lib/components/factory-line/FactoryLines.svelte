<script lang="ts">
	let { lines } = $props();
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>In 1</th>
				<th>In 2</th>
				<th>In 3</th>
				<th>In 4</th>
				<th>Out 1</th>
				<th>Out 2</th>
				<th>Count (todo)</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each lines as line}
				<tr class="table-row">
					<td
						>{#if line.INITEMNAME1}{line.INITEMNAME1}
							{line.INAMOUNT1 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.INAMOUNT1 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td
						>{#if line.INITEMNAME2}{line.INITEMNAME2}
							{line.INAMOUNT2 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.INAMOUNT2 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td
						>{#if line.INITEMNAME3}{line.INITEMNAME3}
							{line.INAMOUNT3 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.INAMOUNT3 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td
						>{#if line.INITEMNAME4}{line.INITEMNAME4}
							{line.INAMOUNT4 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.INAMOUNT4 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td
						>{#if line.OUTITEMNAME1}{line.OUTITEMNAME1}
							{line.OUTAMOUNT1 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.OUTAMOUNT1 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td
						>{#if line.OUTITEMNAME2}{line.OUTITEMNAME2}
							{line.OUTAMOUNT2 * line.LINEAMOUNT}{#if line.TODOAMOUNT > 0}
								<span style="color: red;">({line.OUTAMOUNT2 * line.TODOAMOUNT})</span>
							{/if}{/if}</td
					>
					<td>
						{line.LINEAMOUNT}
						{#if line.TODOAMOUNT > 0}
							<span style="color: red;">({line.TODOAMOUNT})</span>
						{/if}
					</td>
					<td>
						<a href="/edit/line/{line.ROWID}">Edit</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="button-container">
		<a href="/edit/line">+</a>
	</div>
</div>

<style>
	/* Table Container Styling */
	.table-container {
		margin: 20px auto;
		width: 90%;
		background-color: rgba(14, 14, 14, 255);
		border-radius: 10px;
		border: 1px solid rgba(250, 149, 73, 255);
		padding: 20px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	/* Button Styling */
	.button-container {
		align-self: flex-start;
	}

	a {
		background-color: rgba(250, 149, 73, 255);
		color: white;
		text-decoration: none;
		padding: 10px 15px;
		border-radius: 5px;
		margin: 0.5rem;
		font-size: 1rem;
		font-weight: normal;
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	a:hover {
		background-color: rgba(250, 149, 73, 0.8);
		transform: translateY(-2px);
	}

	a:active {
		transform: scale(0.98);
	}

	/* Table Styling */
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 10px;
	}

	th,
	td {
		border: 1px solid rgba(250, 149, 73, 255);
		padding: 10px;
		text-align: center;
	}

	th {
		background-color: rgba(250, 149, 73, 255);
		color: black;
		font-weight: bold;
	}

	.table-row {
		height: 4rem;
	}

	tbody tr:nth-child(even) {
		background-color: rgba(250, 149, 73, 0.1);
	}

	tbody tr:hover {
		background-color: rgba(250, 149, 73, 0.2);
	}

	/* Highlight TODO Amount Styling */
	span {
		color: red;
		font-weight: bold;
	}

	/* Responsive Styling */
	@media (max-width: 768px) {
		div {
			padding: 15px;
		}

		th,
		td {
			padding: 8px;
		}

		table {
			width: 100%;
		}
	}
</style>
