<script lang="ts">
	let { lines } = $props();
</script>

<div>
	<table>
		<thead>
			<tr>
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
			{#each lines as line}
				<tr>
					<td>{line.INITEMNAME1} {line.INAMOUNT1}</td>
					<td>{line.INITEMNAME2} {line.INAMOUNT2}</td>
					<td>{line.INITEMNAME3} {line.INAMOUNT3}</td>
					<td>{line.INITEMNAME4} {line.INAMOUNT4}</td>
					<td>{line.OUTITEMNAME1} {line.OUTAMOUNT1}</td>
					<td>{line.OUTITEMNAME2} {line.OUTAMOUNT2}</td>
					<td>
						{line.LINEAMOUNT}
						{#if line.TODOAMOUNT > 0}
							<span style="color: red;">({line.TODOAMOUNT})</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	/* Table Container Styling */
	div {
		margin: 20px auto;
		width: 90%;
		background-color: rgba(14, 14, 14, 255);
		border-radius: 10px;
		border: 1px solid rgba(250, 149, 73, 255);
		padding: 20px;
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
