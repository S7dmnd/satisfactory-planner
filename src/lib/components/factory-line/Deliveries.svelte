<script lang="ts">
	let { deliveries } = $props();
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>Source</th>
				<th>Destination</th>
				<th>Item</th>
				<th>Amount</th>
				<th>Method</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each deliveries as delivery}
				<tr class="table-row">
					<td>{delivery.SOURCEFACTORYNAME}</td>
					<td>{delivery.DESTINATIONFACTORYNAME}</td>
					<td>{delivery.ITEMNAME}</td>
					<td
						>{#if delivery.AMOUNT > 0}
							<span style="color: green;">→{delivery.AMOUNT}</span>
						{:else}
							<span style="color: red;">←{delivery.AMOUNT}</span>
						{/if}</td
					>
					<td>{delivery.METHOD}</td>
					<td>
						<a href="/edit/delivery/{delivery.DELIVERYID}">Edit</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="button-container">
		<a href="/edit/delivery">+</a>
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
