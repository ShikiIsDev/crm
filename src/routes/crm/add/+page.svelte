<script>
import { goto } from "$app/navigation";
export let data;
import MultiSelect from "svelte-multiselect";
let selectedCountryCode = "";
let selectedTags = [];
import { v4 as uuidv4 } from "uuid";
import { supabase } from "$lib/supabaseClient.js";

let selectedCountry = "";

let fileInput;
let files = [];
let fileNames = [];
let email = "";

const tags = [
	{ value: "architect", label: "Architect" },
	{ value: "interior designer", label: "Interior Designer" },
	{ value: "cs engineer", label: "CS Engineer" },
	{ value: "mep engineer", label: "MEP Engineer" },
	{ value: "facility management", label: "Facility Management" },
	{ value: "quantity surveyor", label: "Quantity Surveyor" },
	{ value: "project management", label: "Project Management" },
	{ value: "owner", label: "Owner" },
	{ value: "agencies", label: "Agencies" },
	{ value: "supplier", label: "Supplier" },
];

function convertBlobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

async function handleFileUpload(event) {
	const uploadedFiles = Array.from(event.target.files); // Convert FileList to Array
	if (uploadedFiles.length > 0) {
		files = [...files, ...uploadedFiles]; // Add new files to the existing array
		fileNames = files.map((file) => file.name); // Update file names array
	}
}

function handleDrop(e) {
	e.preventDefault();
	const uploadedFiles = Array.from(e.dataTransfer.files); // Convert FileList to Array
	if (uploadedFiles.length > 0) {
		files = [...files, ...uploadedFiles]; // Add new files to the existing array
		fileNames = files.map((file) => file.name); // Update file names array
	}
}

function removeFile(index) {
	files = files.filter((_, i) => i !== index); // Create a new array excluding the file at the given index
	fileNames = files.map((file) => file.name); // Update the file names array
}

async function handleSubmit(event) {
	const formData = new FormData(); // Create FormData object from the form

	formData.append("company_name", document.querySelector('input[name="company_name"]').value);
	formData.append("email", email);
	formData.append("first_name", document.querySelector('input[name="first_name"]').value);
	formData.append("last_name", document.querySelector('input[name="last_name"]').value);
	formData.append("tags", selectedTags.map((tag) => tag.value).join(","));
	formData.append(
		"contact_no",
		`${selectedCountryCode}${document.querySelector('input[name="contact_no"]').value}`,
	);
	formData.append(
		"whatsapps",
		`${selectedCountryCode}${document.querySelector('input[name="whatsapps"]').value}`,
	);
	formData.append("country", selectedCountry);
	formData.append("company_reg", document.querySelector('input[name="company_reg"]').value);
	formData.append("website", document.querySelector('input[name="website"]').value);
	formData.append("pspc_category", document.querySelector('input[name="pspc_category"]').value);
	formData.append("instagram", document.querySelector('input[name="instagram"]').value);
	formData.append("facebook", document.querySelector('input[name="facebook"]').value);
	formData.append("builtsearch_url", document.querySelector('input[name="builtsearch_url"]').value);
	formData.append("remarks", document.querySelector('input[name="remarks"]').value);
	formData.append("pdpa", document.querySelector('input[name="pdpa"]').value);

	try {
		// Make the API call
		const response = await fetch("/crm", {
			// Replace with the actual endpoint
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		for (const file of files) {
			const uniqueFileName = `${uuidv4()}-${file.name}`;
			const filePath = `attachments/${uniqueFileName}`;

			const formData_attachments = new FormData();
			formData_attachments.append("file_path", filePath);
			formData_attachments.append("name", file.name);
			formData_attachments.append("email", email);

			const { data, error } = await supabase.storage
				.from("attachments")
				.upload(filePath, file, { upsert: true });

			if (error) {
				console.log(error);
			}

			const resp = await fetch("/crm/add", {
				method: "POST",
				body: formData_attachments,
			});
		}

		goto("/crm");
	} catch (error) {
		console.error("Error:", error);
		alert(`Error: ${error.message}`);
	}
}
</script>

<div class="body">
	<div class="form-card">
		<h1>Add Row</h1>
		<div class="form">
			<div class="form-group">
				<label for="company_name">Company Name</label>
				<input type="text" name="company_name" />
			</div>

			<div class="form-group">
				<label for="email" required>Email (required)</label>
				<input type="email" name="email" required bind:value={email} />
			</div>

			<div class="form-group" required>
				<label for="first_name">First Name (required)</label>
				<input type="text" name="first_name" required />
			</div>

			<div class="form-group">
				<label for="last_name">Last Name</label>
				<input type="text" name="last_name" />
			</div>

			<div class="form-group">
				<label for="tags">Tags</label>
				<MultiSelect bind:selected={selectedTags} placeholder="Select Tags" options={tags} />
			</div>

			<div class="form-group">
				<label for="contact_no">Contact No.</label>
				<div class="input-group">
					<select name="country_code" bind:value={selectedCountryCode}>
						<option value="" disabled selected>Select Country Code</option>
						{#each data.countryCodes as { value, label }}
							<option {value}>{label}</option>
						{/each}
					</select>
					<input type="text" name="contact_no" placeholder="Your number" />
				</div>
			</div>

			<div class="form-group">
				<label for="whatsapps">Whatsapps</label>
				<div class="input-group">
					<select name="country_code" bind:value={selectedCountryCode}>
						<option value="" disabled selected>Select Country Code</option>
						{#each data.countryCodes as { value, label }}
							<option {value}>{label}</option>
						{/each}
					</select>
					<input type="text" name="whatsapps" placeholder="Whatsapps number" />
				</div>
			</div>

			<div class="form-group">
				<label for="country">Country</label>
				<div class="input-group">
					<select name="country" bind:value={selectedCountry}>
						<option value="" disabled selected>Select Country</option>
						{#each data.countryNames as { name }}
							<option value={name}>{name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="form-group">
				<label for="company_reg">Company Reg.</label>
				<input type="text" name="company_reg" />
			</div>

			<div class="form-group">
				<label for="website">Website</label>
				<input type="text" name="website" />
			</div>

			<div class="form-group">
				<label for="pspc_category">PSPC Category</label>
				<input type="text" name="pspc_category" />
			</div>

			<div class="form-group">
				<label for="instagram">Instagram</label>
				<input type="text" name="instagram" />
			</div>

			<div class="form-group">
				<label for="facebook">Facebook</label>
				<input type="text" name="facebook" />
			</div>

			<div class="form-group">
				<label for="builtsearch_url">BuiltSearch URL</label>
				<input type="text" name="builtsearch_url" />
			</div>

			<div class="form-group">
				<label for="remarks">Remarks</label>
				<input type="text" name="remarks" />
			</div>

			<div class="form-group">
				<label for="pdpa">PDPA (Y/N)</label>
				<input type="text" name="pdpa" />
			</div>

			<div class="upload-container">
				<div class="upload" on:drop={handleDrop} on:dragover={(e) => e.preventDefault()}>
					<span> Choose files or drag them here</span>
					<button
						on:click={(e) => {
							fileInput.click();
						}}>Browse File</button>
				</div>

				<input
					multiple
					type="file"
					bind:this={fileInput}
					id="file"
					style="display: none"
					on:change={handleFileUpload} />
			</div>

			{#if files.length > 0}
				<div class="file-list">
					<h4>Uploaded Files:</h4>

					{#each files as file, index}
						<div class="file-field">
							<div class="file-display">
								{file.name}
							</div>
							<button class="remove" on:click={() => removeFile(index)}> Remove </button>
						</div>
					{/each}
				</div>
			{/if}

			<button type="submit" on:click={handleSubmit}>Submit</button>
		</div>
	</div>
</div>

<style lang="scss">
.upload-container {
	display: flex;
	margin-bottom: 1rem;
	.upload {
		padding: 1rem;
		cursor: default;
		display: flex;
		flex-direction: column;
		width: min(100%, 450px);
		aspect-ratio: 3 / 2;
		margin-inline: auto;
		border: 2px dashed #82868f;
		border-radius: 1rem;
		gap: 1rem;
		background-color: #f4f6f6;
		align-items: center;
		justify-content: center;
		span {
			color: #344856;
		}
		.file-list {
			padding: 0.5rem;
			gap: 0.5rem;
			display: flex;
			flex-direction: column;

			.file-field {
				display: flex;
				justify-content: space-between;
				gap: 0.5rem;
			}
			.file-display {
				display: inline;
				justify-content: space-between;
				padding: 0.5rem;
				gap: 0.5rem;
				border: 1px solid #e0e0e0;
				border-radius: 5px;
			}
		}
	}
}

.body {
	font-family: "Poppins";
	background-color: #f9fafc;
	display: flex;
	justify-content: flex-start; /* Align to top */
	align-items: flex-start; /* Align to top */
	padding: 2rem;
	width: 100%;
	height: 100vh; /* Ensure the body takes full height */
}

.form-card {
	background: #ffffff;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	padding: 2rem;
	max-width: 600px;
	width: 100%;
}

h1 {
	font-size: 1.75rem;
	margin-bottom: 1.5rem;
	text-align: center;
	color: #333;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.form-group {
	display: flex;
	flex-direction: column;
}

.input-group {
	display: flex;
	gap: 0.5rem;
}

label {
	font-size: 0.875rem;
	margin-bottom: 0.5rem;
	color: #555;
}

input,
select {
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 5px;
	font-size: 1rem;
	width: 100%;
}

input:focus,
select:focus {
	border-color: #007bff;
	outline: none;
	box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

button {
	background-color: #007bff;
	padding: 0.75rem;
	color: white;
	border: none;
	border-radius: 5px;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s;
}

button:hover {
	background-color: #0056b3;
}
</style>
