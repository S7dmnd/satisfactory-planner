<!-- Loading.svelte -->
<script>
	let { message } = $props();
</script>

<div class="loader">
	<div class="spinner"></div>
	<p>{message}</p>
</div>

<style>
	/* Loader Styling */

	.loader {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		z-index: 1000;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid rgba(250, 149, 73, 0.8);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loader p {
		margin-top: 10px;
		font-size: 1.2em;
		color: #555;
	}
</style>
