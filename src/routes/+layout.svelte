<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<a href="/todo">TODO</a>
	<a href="/factory-line">Lines</a>
	<a href="/edit">Add</a>
</nav>
{@render children()}
