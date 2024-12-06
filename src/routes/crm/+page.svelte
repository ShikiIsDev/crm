<script>
    import Icon from '@iconify/svelte';
    import * as XLSX from "xlsx";
    import { supabase } from "$lib/supabaseClient.js";
    import readXlsxFile from 'read-excel-file';
    import { json } from '@sveltejs/kit';

    export let data;
    // console.log(data);

    let showHiddenFields = false;
    let editingRow = null; 
    let editedData = null;

    // Each checkbox will be bound to a unique entry in this object
    let checkedFields = {
        company_name: true,  // Default to true (checked)
        email: true,         // Default to true (checked)
        contact: true,       // Default to true (checked)
        first_name: true,    // Default to true (checked)
        last_name: true,     // Default to true (checked)
        country: false,      // Country default is unchecked
        website: false,
        facebook: false,
        instagram: false,
        whatsapps: false,
        company_reg: false,
        pspc_cat: false,
        tags: true,
    };

    let sortConfig = {
        key: null,      // Column to sort by (e.g., 'company_name')
        direction: null // 'asc' for ascending, 'desc' for descending
    };

    const show_fields = [
        { value: "company_name", label: "Company Name" },
        { value: "email", label: "Email" },
        { value: "contact", label: "Contact No." },
        { value: "first_name", label: "First Name" },
        { value: "last_name", label: "Last Name" }
    ];

    const hidden_fields = [
        { value: "country", label: "Country" },
        { value: "website", label:"Website" },
        { value: "facebook", label:"Facebook" },
        { value: "instagram", label:"Instagram" },
        { value: "whatsapps", label:"Whatsapp" },
        { value: "company_reg", label:"Company Reg." },
        { value: "pspc_cat", label:"PSPC Category" },
        { value:"builtsearchUrl", label:"BuiltSearch URL"}
    ];

    const tags = [
        { value: "architect", label: "Architect"},
        { value: "interior designer", label: "Interior Designer"},
        { value: "cs engineer", label: "CS Engineer"},
        { value: "mep engineer", label: "MEP Engineer"},
        { value: "facility management", label: "Facility Management"},
        { value: "quantity surveyor", label: "Quantity Surveyor"},
        { value: "project management", label: "Project Management"},
        { value: "owner", label: "Owner"},
        { value: "agencies", label: "Agencies"},
        { value: "supplier", label: "Supplier"}
    ];

    function filter() {
        showHiddenFields = !showHiddenFields;
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];

        if (file) {
            upload(file);
        } else {
            console.error("No file selected.");
        }
        }

    async function upload(file) {
        try {
            // Step 1: Parse Excel File
            const rows = await readXlsxFile(file);

            const headers = rows[0]; // Extract headers from the first row
            const data = rows.slice(1).map((row) => {
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });

            // Normalize all keys and values
            const normalizedObj = {};
            Object.entries(obj).forEach(([key, value]) => {
                // Normalize keys
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
                
                // Normalize values (if it's a string)
                let normalizedValue = value;
                if (typeof value === 'string') {
                    normalizedValue = value.toLowerCase().replace(/\s+/g, '_');
                }
                
                normalizedObj[normalizedKey] = normalizedValue;
            });

            return normalizedObj;
        });

            console.log("Extracted Data:", data);

            // Step 2: Upload Data to Supabase

            for (const row of data) {
                // console.log(row);
                const email = row.email;
                console.log(email)
                const formData = new FormData();
                        Object.entries(row).forEach(([key, value]) => {
                            formData.append(key, value);
                        });
                console.log(formData);
                const { data: existingRows, error: fetchError } = await supabase
                    .from('contacts')
                    .select('email') // Select only the email column to reduce data fetched
                    .eq('email', email); // Filter for the specific email

                if (fetchError) {
                    console.error("Error checking email existence:", fetchError);
                    
                    continue;
                }

                if (existingRows.length > 0) {
                    // Email exists in the database
                    const existingData = existingRows[0];
                    console.log(`Email already exists: ${email}`);
                    
                    const userConfirmed = confirm(
                        `The email ${email} already exists in the database.\n` +
                        `Do you want to overwrite the existing data?\n\n` +
                        `Existing Data: ${JSON.stringify(existingData, null, 2)}\n` +
                        `New Data: ${JSON.stringify(row, null, 2)}`
                    );

                    if (userConfirmed) {
                        

                        const resp = await fetch('/update', {
                            method: 'POST',
                            body: formData,
                        });

                        if (resp.ok) {
                            console.log("Update Successful");
                        } else {
                            console.log("Update failed")
                        }
                    }
                } else {

                    const resp = await fetch('/upload', {
                        method:'POST',
                        body: formData,
                    });

                    if (resp.ok) {
                        console.log("Upload Successful");
                    } else {
                        console.log("Upload failed");
                    }
                }

            }
        } catch (error) {
            console.error("Error uploading data:", error.message);
            alert('Failed to upload the file.');
        }
    }

    function exportToExcel() {
        if (!data || !data.data || data.data.length === 0) {
            alert("No data available to export.");
            return;
        }

        // Extract all unique headers from the dataset
        const headers = Object.keys(data.data[0]);

        // Map the data into rows with all fields
        const rows = data.data.map(row =>
            headers.reduce((acc, key) => {
                acc[key] = row[key] ?? ""; // Handle missing fields
                return acc;
            }, {})
        );

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Full Data");

        // Trigger download
        XLSX.writeFile(workbook, "full_data_export.xlsx");
    }

    // This is necessary for the checkboxes to update properly when data changes
    $: {
        show_fields.forEach(field => {
            if (!(field.value in checkedFields)) {
                checkedFields[field.value] = true; // Default to true (checked)
            }
        });
    }

    function sortData(key) {
        if (sortConfig.key === key) {
            // If the same column is clicked, toggle the direction
            sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // Otherwise, set it to ascending for the new column
            sortConfig.key = key;
            sortConfig.direction = 'asc';
        }

        // Sort the data
        const sortedData = [...data.data].sort((a, b) => {
            const valA = a[key] || ''; // Handle undefined values
            const valB = b[key] || ''; // Handle undefined values

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        // Reassign to trigger reactivity
        data = { ...data, data: sortedData };
    }

    async function deleteRow(email) {
        const confirmation = confirm("Are you sure you want to delete this row?");
        if (!confirmation) return;

        try {

            const formData = new FormData();
            formData.append("email", email);

            const resp = await fetch('/delete', {
                method:'POST',
                body: formData,
            });

            if (resp.ok) {
                console.log("Delete successful");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    // async function updateRow(updatedRow) {
    //     try {
    //         console.log("update")
    //         const response = await fetch('/update', {
    //             method: 'POST',
    //             body: JSON.stringify(updatedRow),
    //         });

    //         if (response.ok) {
    //             console.log("Row updated successfully!");
    //             // Refresh data or update the local state
    //             editingRow = null; // Exit editing mode
    //         } else {
    //             console.error("Failed to update the row");
    //         }
    //     } catch (error) {
    //         console.error("Error updating the row:", error);
    //     }
    // }

    function editRow(row) {
        console.log('Editing row:', row);
        editingRow = row.id;
        console.log(editingRow);
        editedData = { ...row };
        console.log('Edited data initialised:', editedData);
    }

    async function saveRow() {
        try {
            console.log('Saving row:', editedData);

            const resp = await fetch('/edit', {
                method:'POST',
                body: JSON.stringify(editedData),
            });

            const result = await resp.json();

            if (result.success) {
                console.log(result.message);
            } else {
                console.error('Fetch error:', result.message);
            }
        } catch (err) {
            console.error('Error saving row via API:', err);
        }
    }

    // Cancel editing
    function cancelEdit() {
        editingRow = null; // Exit editing mode
    }

</script>

<div class="body">
    <div class="contact">
        <div class="header">
            <p>Contact</p>
            <div class="functions">
                <div class="search-field">
                    <input type="text" placeholder="Search...">
                </div>
                <div>
                    <label for="import-file" class="import-button">
                        Import Excel
                    </label>
                    <input
                        id="import-file"
                        type="file"
                        accept=".xlsx, .xls"
                        on:change={handleFileUpload}
                        
                        style="display: none;"
                    />
                </div>
                <button on:click={exportToExcel} class="export">
                    Export to Excel
                </button>
                <div class="filter">
                    <button on:click={filter}>
                        <Icon icon="mdi:filter" height="1rem" width="1rem"></Icon>
                    </button>
                    {#if showHiddenFields === true}
                        <div class="hidden-fields">
                            {#each hidden_fields as field}
                                <div class="hidden-item">
                                    <input type="checkbox" 
                                           id={field.value} 
                                           bind:checked={checkedFields[field.value]}>
                                    {field.label}
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="add">
                    <a href="/add">
                        <button class="add-row">
                            Add
                        </button>
                    </a>
                </div>
            </div>
        </div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        {#each Object.keys(checkedFields) as key (key)}
                            {#if checkedFields[key]}
                                <th>
                                    <div class="header-content" on:click={() => sortData(key)}>
                                        {key.replace('_', ' ').toUpperCase()}

                                        <div class="sort">
                                            <!-- Show sort icon based on the current column and direction -->
                                            {#if sortConfig.key === key}
                                                {#if sortConfig.direction === 'asc'}
                                                    <Icon icon="akar-icons:arrow-up" />
                                                {:else}
                                                    <Icon icon="akar-icons:arrow-down" />
                                                {/if}
                                            {/if}
                                        </div>
                                    </div>
                                </th>
                            {/if}
                        {/each}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.data as item (item.id)}
                        <tr>
                            {#each Object.keys(checkedFields) as key (key)}
                                {#if checkedFields[key]}
                                    <td>
                                        {#if editingRow === item.id}
                                            <input
                                                type="text"
                                                bind:value={editedData[key]}
                                            />
                                        {:else}
                                            {item[key]}
                                        {/if}
                                    </td>
                                {/if}
                            {/each}
                            <!-- <td>
                                <button on:click={() => deleteRow(item.email)} class="delete-button">
                                    Delete
                                </button>
                            </td> -->
                            <td>
                                {#if editingRow === item.id}
                                    <button on:click={saveRow} class="save-button">
                                        Save
                                    </button>
                                    <button on:click={cancelEdit} class="cancel-button">
                                        Cancel
                                    </button>
                                {:else}
                                    <button on:click={() => editRow(item)} class="edit-button">
                                        Edit
                                    </button>
                                    <button on:click={() => deleteRow(item.email)} class="delete-button">
                                        Delete
                                    </button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style lang="scss">
    .body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;

        .contact {
            padding: 1rem;

            .header {
                display: flex;
                justify-content: space-between; 
                align-items: center; 
                padding: 0.5rem 1rem;

                p {
                    margin: 0;
                    font-weight: 600;
                    font-size: 2rem;
                }

                .functions {
                    display: flex;
                    gap: 0.5rem; 

                    .search-field {
                        input {
                            padding: 0.5rem;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            outline: none;
                        }
                    }

                    .add-row {
                        background-color: #007bff; 
                        color: white; /* White text */
                        height: 2rem; /* Fixed height */
                        padding: 0 1rem; /* Horizontal padding only */
                        font-size: 1rem;
                        border: none;
                        border-radius: 5px; /* Rounded corners */
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.3s, transform 0.2s;
                    }

                    .add-row:hover {
                        background-color: #1272d9;
                    }

                    .export {
                        background-color: #007bff; 
                        color: white; /* White text */
                        height: 2rem; /* Fixed height */
                        padding: 0 1rem; /* Horizontal padding only */
                        font-size: 1rem;
                        border: none;
                        border-radius: 5px; /* Rounded corners */
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.3s, transform 0.2s;
                    }

                    .export:hover {
                        background-color: #1272d9; /* Darker green on hover */
                    }

                    @media (max-width: 640px) {
                        .export {
                            height: 32px; /* Adjust height for smaller screens */
                            font-size: 14px; /* Smaller font size */
                        }
                    }

                    .filter {
                        display: flex;
                        flex-direction: column;

                        button {
                            padding: 0.5rem;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            align-content: center;
                            height: 2rem;
                            width: 2rem;
                        
                            .hidden-fields {
                                display: flex;
                                flex-direction: column;
                                gap: 0.5rem;
                                border: 1px solid #82868F;
                                border-radius: 5px;
                            }

                            &:hover {
                                background-color: #0056b3;
                            }
                        }
                    }
                }
            }

            table {
                width: 100%;
                border-collapse: collapse;
                flex-wrap: nowrap;
                th {
                    padding-left: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #4185F4;
                    text-align: left;
                    flex-wrap: nowrap;

                    .header-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
                td {
                    
                    padding: 1rem;
                    flex-wrap: nowrap;
                    border-bottom: 1px solid #82868F;
                }

                .tags {
                    color: #AEAEAE;
                    border: 1px solid #AEAEAE;
                    border-radius: 5px;
                    width: fit-content;
                    padding: 0.5rem;
                    font-size: 0.5rem;
                    margin: 0.5rem;
                }
            }
        }
    }
</style>
