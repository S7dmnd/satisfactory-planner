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
