<script>
import Icon from "@iconify/svelte";
import * as XLSX from "xlsx";
// import { supabase } from "$lib/supabaseClient.js";
import readXlsxFile from "read-excel-file";
import { json } from "@sveltejs/kit";
import { goto, invalidateAll } from "$app/navigation";

export let data;
// console.log(data);

let { supabase } = data;

let isOpen = false;

function openBar() {
	if (isOpen === false) {
		isOpen = true;
	} else if (isOpen === true) {
		isOpen = false;
	}
}

async function handleLogout() {
	console.log("signing out");
	const { error } = await supabase.auth.signOut();

	invalidateAll();

	console.log(error);
	// location.reload();
}

function navtigate(path) {
	goto(path);
}
</script>

<main>
	<div class="sidebar">
		{#if isOpen === true}
			<div class="content">
				<div class="logo">
					<img src="builtSearchLogo.png" alt="logo" />
				</div>
				<a href="/crm">
					<div class="add">Home</div>
				</a>
				<a href="/crm/globalContact">
					<div class="add">Global Contacts</div>
				</a>
				<a href="/crm/dashboard">
					<div class="dashboard">Dashboard</div>
				</a>
				<div class="logout" on:click={handleLogout}>Logout</div>
				<div class="footer">
					<div class="builtSearch">
						<span> Powered By </span>
						<img src="logoName.png" alt="logoName" />
					</div>
					<hr />
					<span> Terms | Privacy </span>
				</div>
			</div>
		{/if}

		<div class="arrow" on:click={openBar}>
			{#if isOpen === false}
				<Icon icon="majesticons:arrow-left-line" width="24" height="24"></Icon>
			{:else}
				<Icon icon="majesticons:arrow-right-line" width="24" height="24"></Icon>
			{/if}
		</div>
	</div>
	<div class="table">
		<slot />
	</div>
</main>

<style lang="scss">
main {
	display: flex;
	flex-direction: row; /* Arrange content vertically */
	min-height: 100vh; /* Ensure main spans the full viewport height */
	font-family: "Poppins";
	position: relative;

	a {
		text-decoration: none;
		color: black;
	}

	.logo img {
		max-width: 100%;
		height: auto;
		max-height: 60px;
		display: block;
	}

	.sidebar {
		display: relative;
		position: sticky;
		padding: 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		width: auto; /* Fixed sidebar width */
		height: 100vh; /* Fixed height for the sidebar */

		.content {
			height: 100vh;
			width: 15vw;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			flex: 1;

			.add,
			.dashboard,
			.logout {
				display: flex;
				padding: 0.2rem;
			}

			.logout {
				background-color: white;
				color: #e9686a;
			}

			.add:hover,
			.dashboard:hover {
				background-color: rgb(224, 209, 209);
				cursor: pointer;
			}

			.logout:hover {
				background-color: #e9686a;
				color: white;
				cursor: pointer;
			}
		}

		.arrow {
			padding: 0.3rem;
			height: fit-content;
		}

		.arrow:hover {
			background-color: rgb(224, 209, 209);
			cursor: pointer;
		}
	}
}

.table {
	flex: 1; /* Ensures it takes up available space */
	margin: auto;
}

.footer {
	margin-top: auto; /* Push the footer to the bottom */
	width: 100%;
	text-align: center;
	padding: 20px 10px;

	.builtSearch {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 14px;
		color: #6c757d;
	}

	.builtSearch img {
		height: 20px;
		width: auto;
	}

	hr {
		margin: 10px auto;
		border: none;
		border-top: 1px solid #dee2e6;
		width: 90%;
	}

	span {
		font-size: 14px;
		color: #6c757d;

		a {
			text-decoration: none;
			color: #007bff;
		}

		a:hover {
			text-decoration: underline;
		}
	}
}
</style>
