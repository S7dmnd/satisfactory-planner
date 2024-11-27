<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	body {
		font-family: Arial, sans-serif;
		background-color: rgba(14, 14, 14, 255);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	h1 {
		color: rgba(250, 149, 73, 255);
		text-align: center;
		margin-bottom: 20px;
	}
</style>
