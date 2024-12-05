<script lang="ts">
	let { form } = $props();
</script>

<div class="sign-up-page-container">
	<h1>Sign up Page!!</h1>

	<form method="POST">
		{#if form?.usernameRedundancy}<p class="error">Username already used</p>{/if}
		<div class="input-container">
			<label for="username">ID: </label>
			<input type="text" id="username" name="username" placeholder="Username" required />
		</div>
		<div class="input-container">
			<label for="password">PW: </label>
			<input type="password" id="password" name="password" placeholder="Password" required />
		</div>

		<button type="submit">Sign up</button>
	</form>

	<a href="/">
		<button type="button">Login?</button>
	</a>
</div>

<style>
	.sign-up-page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1rem;
	}

	h1 {
		margin-bottom: 20px;
		color: rgba(250, 149, 73, 0.9);
		font-size: 2rem;
	}

	form {
		background-color: rgba(34, 34, 34, 1);
		padding: 40px;
		border-radius: 15px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	label {
		font-weight: 600;
		color: rgba(250, 149, 73, 0.9);
	}

	input[type='text'],
	input[type='password'] {
		padding: 12px;
		border-radius: 8px;
		border: 1px solid rgba(250, 149, 73, 0.8);
		background-color: rgba(250, 149, 73, 0.15);
		color: rgba(255, 255, 255, 0.9);
		width: calc(100% - 24px);
		transition: box-shadow 0.3s ease;
	}

	input:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(250, 149, 73, 0.5);
		border-color: rgba(250, 149, 73, 1);
	}

	button {
		background-color: rgba(250, 149, 73, 255);
		color: white;
		border: none;
		margin: 12px;
		padding: 12px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		font-weight: normal;
		letter-spacing: 0.5px;
	}

	button:hover {
		background-color: rgba(250, 149, 73, 0.85);
		transform: translateY(-3px);
	}

	button:active {
		transform: scale(0.96);
	}
</style>
