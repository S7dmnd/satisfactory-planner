<script lang="ts">
</script>

<div class="sign-up-page-container">
	<h1>Sign up Page!!</h1>

	<form method="POST" action="?/signUp">
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" required />

		<label for="password">Password:</label>
		<input type="password" id="password" name="password" required />

		<button type="submit">Sign up</button>
	</form>
</div>

<style>
	.sign-up-page-container {
		flex-direction: column;
	}
	button {
		background-color: rgba(250, 149, 73, 255);
		color: white;
		border: none;
		padding: 10px 15px;
		margin-right: 10px;
		border-radius: 5px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	button:hover {
		background-color: rgba(250, 149, 73, 0.8);
		transform: translateY(-2px);
	}

	button:active {
		transform: scale(0.98);
	}

	/* Form Container Styling */
	form {
		background-color: rgba(34, 34, 34, 255);
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	input[type='text'],
	input[type='password'] {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(250, 149, 73, 255);
		background-color: rgba(250, 149, 73, 0.2);
		color: black;
		width: calc(100% - 22px);
	}

	input:focus {
		outline: none;
		border-color: rgba(250, 149, 73, 0.8);
	}
</style>
