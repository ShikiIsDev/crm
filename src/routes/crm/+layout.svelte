<script>
import Icon from "@iconify/svelte";
import { goto, invalidateAll } from "$app/navigation";
import { onMount } from "svelte";

export let data;
// console.log(data);

let { supabase } = data;

let isOpen = false;
let isMobileMenuOpen = false;

function openBar() {
	isMobileMenuOpen = !isMobileMenuOpen;
}

onMount(() => {
	const sidebar = document.querySelector(".sidebar");

	sidebar.addEventListener("mouseenter", () => {
		isOpen = true;
	});

	sidebar.addEventListener("mouseleave", () => {
		isOpen = false;
	});
});

async function handleLogout() {
	console.log("signing out");
	const { error } = await supabase.auth.signOut();

	invalidateAll();

	console.log(error);
	// location.reload();
}
</script>

<main>
	<div class="sidebar">
		<button class="hamburger" on:click={openBar} aria-label="Toggle menu">
			<Icon icon="mdi:menu" style="color: #344856" height="2rem" width="2rem" />
		</button>

		<img src="builtSearchLogo.png" alt="logo" />

		<div class="content">
			<div class="icons">
				<a href="/crm">
					<div class="icon">
						<div class="item-icon">
							<Icon icon="lucide:home" style="color: #344856" height="1.2rem" width="1.2rem"></Icon>
						</div>

						<div class="item">Home</div>
					</div>
				</a>
				<a href="/crm/globalContact">
					<div class="icon">
						<div class="item-icon">
							<Icon icon="solar:global-linear" style="color: #344856" height="1.2rem" width="1.2rem"
							></Icon>
						</div>

						<div class="item">Global Contacts</div>
					</div>
				</a>
				<a href="/crm/dashboard">
					<div class="icon">
						<div class="item-icon">
							<Icon
								icon="material-symbols:dashboard-outline-rounded"
								style="color: #344856"
								height="1.2rem"
								width="1.2rem"></Icon>
						</div>

						<div class="item">Dashboard</div>
					</div>
				</a>

				<div class="icon-logout" on:click={handleLogout}>
					<div class="item-icon">
						<Icon icon="material-symbols:logout-rounded" height="1.2rem" width="1.2rem"></Icon>
					</div>

					<div class="item">Logout</div>
				</div>
			</div>

			<div class="footer">
				<div class="builtSearch">
					<div class="text">Powered By</div>
					<img src="logoName.png" alt="logoName" />
				</div>
				<hr />
				<span> Terms | Privacy </span>
			</div>
		</div>
	</div>

	<div class="table">
		<center>
			<slot />
		</center>
	</div>
</main>

<style lang="scss">
main {
	display: flex;
	flex-direction: row;
	font-family: "Poppins";
	height: 100vh;
	color: #344856;
	overflow-x: hidden;
	flex-grow: 1;
	align-items: center;

	.hamburger {
		display: none;
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 2000;
		background: none;
		border: none;
		cursor: pointer;

		&:focus {
			outline: none;
		}

		svg {
			pointer-events: none;
		}
	}

	a {
		text-decoration: none;
	}

	.sidebar {
		display: flex;
		position: fixed;
		height: 100vh; /* Full height of the viewport */
		z-index: 1000;
		width: 2.5rem;
		flex-direction: column;
		padding: 0.5rem;
		background-color: #f8f9fa;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
		transition: width 0.3s ease;

		img {
			height: 2.5rem;
			width: 2.5rem;
			margin-top: 1rem; /* Add consistent spacing from the top */
		}

		&.isOpen {
			transform: translateX(0); // Shown when menu is open
		}

		@media (max-width: 768px) {
			transform: translateX(-100%);
			width: 70vw; // Adjust sidebar width for mobile
		}

		&:hover {
			width: 15vw;
			.content .icons .icon .item {
				display: block;
				opacity: 1;
				transform: translateX(0);
				padding-left: 2rem;
			}

			.content .icons .icon-logout .item {
				display: block;
				opacity: 1;
				transform: translateX(0);
				padding-left: 2rem;
			}

			.footer {
				visibility: visible;
				opacity: 1;
				transform: translateX(0);
			}
		}

		.footer {
			margin-top: auto;
			width: 100%;
			text-align: center;
			visibility: hidden;
			opacity: 0;
			transition:
				transform 0.3s ease,
				opacity 0.3s ease;
			/* Flexbox to ensure it stays at the bottom of the sidebar */
		}

		.content {
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
			transition: opacity 0.3s ease;
			flex-grow: 1;

			.icons {
				display: flex;
				flex-direction: column;

				.icon {
					display: flex;
					flex-direction: row;
					align-items: center; /* Vertically align icon and text */
					gap: 1rem;
					position: relative;
					padding: 0.5rem 0.5rem;
					cursor: pointer;

					&:hover {
						background-color: #b9d9df; /* Add a subtle background */

						border-radius: 5px;
					}

					.item-icon {
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer; /* Make the icon appear interactive */
					}

					.item {
						font-size: 1rem;
						line-height: 1.5rem; /* Matches icon size for alignment */
						color: #333;
						white-space: nowrap; /* Prevent text from wrapping */
						display: none;
						position: absolute; /* Position to ensure it's hidden offscreen */
						transition:
							transform 0.3s ease,
							opacity 0.3s ease; /* Smooth transition for text visibility */

						&:hover {
							cursor: pointer;
						}
					}

					/* Ensure hover applies to both the icon and text */
				}

				.icon-logout {
					display: flex;
					flex-direction: row;
					align-items: center; /* Vertically align icon and text */
					gap: 1rem;
					position: relative;
					padding: 0.5rem 0.5rem;
					cursor: pointer;

					&:hover {
						background-color: #007bff; /* Add a subtle background */

						border-radius: 5px;

						.item {
							color: white; /* Change text color to white */
						}

						.item-icon {
							color: white; /* Change icon color to white */
						}
					}

					.item-icon {
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer; /* Make the icon appear interactive */
					}

					.item {
						font-size: 1rem;
						line-height: 1.5rem; /* Matches icon size for alignment */
						color: #333;
						white-space: nowrap; /* Prevent text from wrapping */
						display: none;
						position: absolute; /* Position to ensure it's hidden offscreen */
						transition:
							transform 0.3s ease,
							opacity 0.3s ease; /* Smooth transition for text visibility */

						&:hover {
							cursor: pointer;
						}
					}

					/* Ensure hover applies to both the icon and text */
				}
			}
		}
	}

	.footer {
		margin-top: auto;
		width: 100%;
		text-align: center;

		margin-bottom: 3rem;

		.builtSearch {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #6c757d;
			flex-direction: column;
		}

		.builtSearch img {
			height: 20px;
			width: auto;
		}

		.text {
			height: 14px;
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

	.table {
		display: flex;
		justify-content: center; /* Center horizontally */
		align-items: center; /* Center vertically */
		flex: 1; /* Allow the table to expand and take available space */
		width: 100%;

		@media (max-width: 768px) {
			margin-left: 0; // Remove left margin on mobile
		}
	}
}
</style>
