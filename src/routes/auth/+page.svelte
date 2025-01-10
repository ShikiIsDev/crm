<script>
let isLoading = false;
</script>

{#if isLoading === true}
	<span class="spinner"></span>
{/if}
<form method="POST" action="?/login" on:submit={() => (loading = true)}>
	<img src="builtSearchLogo.png" alt="logo" />
	<p>Login</p>
	<label>
		<div class="label">Email:</div>
		<input name="email" type="email" />
	</label>
	<label>
		<div class="label">Password:</div>
		<input name="password" type="password" />
	</label>
	<button type="submit">Login</button>
</form>

<style lang="scss">
form {
	font-family: "Poppins";
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: center;
	padding: 1.5rem;
	border: 2px solid #e0e0e0;
	border-radius: 10px;
	max-width: 500px;
	margin: auto;

	/* Add Flexbox properties to center the form on the screen */
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	p {
		font-weight: 600;
		font-size: 1.5rem;
	}

	img {
		max-width: 100%;
		height: auto;
		max-height: 60px;
		display: block;
		margin-bottom: 1rem;
	}

	button {
		width: fit-content;
		background-color: #007bff;
		color: white;
		border: 0px;
		border-radius: 2px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;

		.label {
			width: 80px;
			font-size: 0.9rem;
		}

		input {
			flex: 1;
			border-radius: 2px;
			border: 1px solid #b9d9df;
			padding: 0.5rem;
			font-size: 1rem;
		}
	}
	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid #000;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media screen and (max-width: 768px) {
		padding: 1rem;
		max-width: 90%;

		label {
			flex-direction: column;
			align-items: flex-start;
			width: fit-content;

			.label {
				width: auto;
				margin-bottom: 0.2rem;
			}

			input {
				padding: 1rem;
				width: fit-content; /* Make the input span the full width */
			}
		}

		button {
			width: 100%;
			padding: 0.7rem;
			font-size: 1rem;
		}
	}

	@media screen and (max-width: 480px) {
		p {
			font-size: 1.2rem;
		}

		button {
			font-size: 0.9rem;
		}

		input {
			padding: 1rem;
			width: 100%;
		}
	}
}
</style>
