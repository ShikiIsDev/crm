<script>
    import Icon from '@iconify/svelte';
    import * as XLSX from "xlsx";
    // import { supabase } from "$lib/supabaseClient.js";
    import readXlsxFile from 'read-excel-file';
    import { json } from '@sveltejs/kit';
    import { goto, invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data = [];
    console.log(data.data);

    let { supabase } = data;

    let showHiddenFields = false;
    let editingRow = null; 
    let editedData = null;
    let searchTerm = '';
    let filteredData = [...data.data];
    let originalData = [...data.data];

    let showRows = 10;
    let currentPage = 1;
    let totalPages = Math.ceil(data.data.length / showRows);

    let displayedData = [];
    // updateTableData();

    let rows = data.data.map((row) => ({
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        company_name: row.company_name,
        company_reg: row.company_reg,
        contact: row.contact,
        country: row.country,
        email: row.email,
        facebook: row.facebook,
        instagram: row.instagram,
        tags: row.tags,
        website: row.website,
        whatsapps: row.whatsapps,
        builtsearchUrl: row.builtsearchUrl,
        pspc_cat: row.pspc_cat
    }));

    console.log(data.data.length)

    console.log("totalpages:",totalPages);

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

    function exportToVCF() {
        if (!data || !data.data || data.data.length === 0) {
            alert("No contacts available to export.");
            return;
        }
        // Generate vCard entries for all contacts
        const vCardEntries = data.data.map(contact => {
            return `
        BEGIN:VCARD
        VERSION:3.0
        N:${contact.last_name || ''};${contact.first_name || ''};;;
        FN:${contact.first_name || ''} ${contact.last_name || ''}
        EMAIL:${contact.email || ''}
        TEL;TYPE=CELL:${contact.contact || ''}
        ORG:${contact.company_name || ''}
        ADR:;;${contact.company_reg || ''};;;${contact.country || ''};
        URL:${contact.website || ''}
        NOTE:Tags - ${contact.tags || ''}
        END:VCARD
                `.trim();
            });

        // Combine all entries into a single string
        const vCardContent = vCardEntries.join("\n");

        // Create a blob and trigger download
        const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "contacts.vcf";
        link.click();
    }

    const copyEmailToClipboard = (email) => {
        if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            alert('Email copied to clipboard!');
        }).catch((err) => {
            alert('Failed to copy email: ' + err);
        });
        } else {
        // Fallback for unsupported browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Email copied to clipboard!');
        }
    };


    function handleShowRowsChange(event) {
        showRows = parseInt(event.target.value);
        totalPages = Math.ceil(rows.length / showRows);
        console.log(totalPages)
        currentPage = 1;
        updateTableData();
    }

    function updateTableData() {
        const start = (currentPage - 1) * showRows;
        const end = start + showRows;
        displayedData = rows.slice(start, end);
        data.data = displayedData;
        console.log(displayedData)
    }

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            updateTableData();
            console.log(currentPage)
        }
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            updateTableData();
            console.log(currentPage)
        }
    }

    function search() {
        console.log('test')
        const term = searchTerm.toLowerCase().trim();
        if(term) {
            console.log(term)
            filteredData = data.data.filter(item =>
                Object.values(item).some(value =>
                    value?.toString().toLowerCase().includes(term)
                )
            )

            console.log(filteredData)
            data.data = filteredData;
        } else {
            data.data = [...originalData];
        }
    }

    function filter() {
        showHiddenFields = !showHiddenFields;
    }

    function filterData(item) {

        if (!searchTerm) return true;

        return Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
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
                obj[header] = row[index] ?? ""; // Replace null/undefined with empty string
            });

            // Normalize keys and values
            const normalizedObj = {};
            Object.entries(obj).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase().replace(/\s+/g, ' ');
                let normalizedValue = value;
                if (typeof value === 'string') {
                    normalizedValue = value.toLowerCase().replace(/\s+/g, ' ');
                }
                normalizedObj[normalizedKey] = normalizedValue;
            });

            return normalizedObj;
        });

        // Remove duplicates based on email
        const uniqueData = Array.from(
            new Map(data.map((item) => [item.email, item])).values()
        );

        console.log("Processed Data:", uniqueData);

        // Step 2: Upload Data to Supabase
        for (const row of uniqueData) {
            const email = row.email;

            // Check if email exists in the database
            const { data: existingRows, error: fetchError } = await supabase
                .from('contacts')
                .select('email')
                .eq('email', email);

            if (fetchError) {
                console.error("Error checking email existence:", fetchError);
                alert('An error occurred while verifying existing emails.');
                continue;
            }

            // Handle email existence
            if (existingRows.length > 0) {
                const userConfirmed = confirm(
                    `The email ${email} already exists in the database.\n` +
                    `Do you want to overwrite the existing data?`
                );

                if (userConfirmed) {
                    await updateContact(row);
                } else {
                    console.log(`Skipped update for email: ${email}`);
                }
            } else {
                await createContact(row);
            }
        }

        alert('Upload process completed.');
        location.reload(); // Reload after processing all rows
    } catch (error) {
        console.error("Error uploading data:", error.message);
        alert('Failed to upload the file.');
    }
    }

    async function createContact(row) {
        const formData = new FormData();
        Object.entries(row).forEach(([key, value]) => formData.append(key, value));

        const resp = await fetch('/crm', {
            method: 'POST',
            body: formData,
        });

        if (resp.ok) {
            console.log("Upload Successful for:", row.email);
        } else {
            console.error("Upload failed for:", row.email);
        }
    }

    async function updateContact(row) {
        const formData = new FormData();
        Object.entries(row).forEach(([key, value]) => formData.append(key, value));

        const resp = await fetch('/crm', {
            method: 'PUT',
            body: formData,
        });

        if (resp.ok) {
            console.log("Update Successful for:", row.email);
        } else {
            console.error("Update failed for:", row.email);
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
    function toggleHiddenFields() {
        showHiddenFields = !showHiddenFields;
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

            const resp = await fetch('/crm', {
                method:'DELETE',
                body: formData,
            });

            location.reload();

            if (resp.ok) {
                console.log("Delete successful");
                
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

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

            const resp = await fetch('/crm', {
                method:'PATCH',
                body: JSON.stringify(editedData),
            });

            const result = await resp.json();

            if (result.success) {
                console.log(result.message);
            } else {
                console.error('Fetch error:', result.message);
            }
            location.reload();
        } catch (err) {
            console.error('Error saving row via API:', err);
        }
    }

    // Cancel editing
    function cancelEdit() {
        editingRow = null; // Exit editing mode
    }

    updateTableData();
    

</script>

<div class="body">
    <div class="contact">
      <div class="import-export">
        <div class="import">
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
        <div on:click={exportToExcel} class="export">
          Export Excel
        </div>
  
        <div on:click={exportToVCF} class="export">
          Export VCF
        </div>
      </div>
      <div class="header">
        <p>Contact ({rows.length})</p>
        <div class="functions">
          <div class="search-field">
            <input
              bind:value={searchTerm}
              type="search"
              placeholder="Search..."
              on:input={search} 
            />
          </div>
          <div class="filter">
            <button on:click={toggleHiddenFields}>
              <Icon icon="mdi:filter" height="1rem" width="1rem"></Icon>
            </button>
            <div class="hidden-fields {showHiddenFields ? 'visible' : ''}">
              {#each hidden_fields as field}
                <div class="hidden-item">
                  <input
                    type="checkbox"
                    id={field.value}
                    bind:checked={checkedFields[field.value]}
                  />
                  {field.label}
                </div>
              {/each}
            </div>
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
                        {#if key === 'tags'}
                          {#if item[key]}
                            <div class="tags-field">
                              {#each item[key].split(',') as tag}
                                <span class="tag">
                                  {tags.find(t => t.value === tag.trim().toLowerCase())?.label || tag}
                                </span>{' '}
                              {/each}
                            </div>
                          {:else}
                            N/A
                          {/if}
                        {:else if key === 'contact'}
                          {#if item[key]}
                            <a href={`tel:${item[key]}`} target="_blank" rel="noopener noreferrer">
                              {item[key]}
                            </a>
                          {:else}
                            N/A
                          {/if}
                        {:else if key === 'whatsapps'}
                          {#if item[key]}
                            <a href={`https://wa.me/${item[key]}`} target="_blank" rel="noopener noreferrer">
                              {item[key]}
                            </a>
                          {:else}
                            N/A
                          {/if}
                        {:else if key === 'website' || key === 'builtsearchUrl'}
                          {#if item[key]}
                            <a href={item[key]} target="_blank" rel="noopener noreferrer">
                              {item[key]}
                            </a>
                          {:else}
                            N/A
                          {/if}
                        {:else if key === 'email'}
                          <div on:click={copyEmailToClipboard(item[key])}  class="copy-email">
                            {item[key]}
                          </div>
                        {:else}
                          {item[key]}
                        {/if}
                      {/if}
                    </td>
                  {/if}
                {/each}
                <td>
                  <div class="actions">
                    {#if editingRow === item.id}
                      <button on:click={saveRow} class="save-button">
                        Save
                      </button>
                      <button on:click={cancelEdit} class="cancel-button">
                        Cancel
                      </button>
                    {:else}
                      <button on:click={() => editRow(item)} class="edit-button">
                        <Icon icon="typcn:edit" width="24" height="24"></Icon>
                      </button>
                      <button on:click={() => deleteRow(item.email)} class="delete-button">
                        <Icon icon="material-symbols:delete-outline" width="24" height="24" style="color: #e9686a"></Icon>
                      </button>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
  
      <div class="controls">
        <div class="show-rows">
          <label for="rows-select">Show rows:</label>
          <select name="rows-select" on:change={handleShowRowsChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="pagination">
          <button
            on:click={previousPage}
            class="page-number {currentPage === 1 ? 'disabled' : ''}"
            disabled={currentPage === 1}>
            <Icon icon="line-md:arrow-small-left" />
          </button>
  
          {#each Array(totalPages) as _, index}
            {#if index +1 === currentPage}
              <span class="page-number current">{index+1}</span>
            {:else}
              <button
                on:click={() => {
                  currentPage = index + 1;
                  updateTableData()
                }}
                class="page-number">
                {index + 1}
              </button>
            {/if}
          {/each}
  
          <button on:click={nextPage} class="page-number" disabled={currentPage === totalPages}>
            <Icon icon="line-md:arrow-small-right" />
          </button>
        </div>
      </div>
    </div>
  </div>

<style lang="scss">
    .body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        display: flex;
        min-height: 100vh;
        background-color: #f9fafc;
        width: 100%;
        padding: 1rem;

                .import-export {
                    display: flex;
                    gap: 0.5rem;
                }

                .import {
                        display: flex;
                        flex-direction: row;
                        background-color: white;
                        color: #007bff;
                        border: #007bff 1px solid;
                        align-items: center;
                        padding: 0.5rem;
                        border-radius: 5px;
                        width: fit-content;
                    }

                    .import:hover {
                        background-color: rgb(213, 204, 204);
                        cursor: pointer;
                    }

                    .export {
                        display: flex;
                        flex-direction: row;
                        background-color: white;
                        color: #82868f;
                        border: #82868f 1px solid;
                        align-items: center;
                        padding: 0.5rem;
                        border-radius: 5px;
                        width: fit-content;
                    }

                    .export:hover {
                        background-color: rgb(213, 204, 204);
                        cursor: pointer;
                    }
        
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

                    @media (max-width: 640px) {
                        .export {
                            height: 32px; /* Adjust height for smaller screens */
                            font-size: 14px; /* Smaller font size */
                        }
                    }

                    .filter {
                        position: relative; /* This makes the filter button the parent for positioning */

                        button {
                            padding: 0.5rem;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            height: 2rem;
                            width: 2rem;

                            &:hover {
                                background-color: #0056b3;
                            }
                        }

                        .hidden-fields {
                            position: absolute; /* Position relative to the button */
                            top: 2.5rem; /* Place it below the button */
                            left: 50%; /* Align with the center of the button horizontally */
                            transform: translateX(-50%); /* Center it using translation */
                            background-color: white;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
                            padding: 10px;
                            border: 1px solid #ccc;
                            z-index: 1000; /* Ensure it overlaps other elements */
                            display: none; /* Hidden by default */
                            grid-template-columns: repeat(2, 1fr); /* 2 columns of equal width */
                            grid-gap: 10px; /* Add space between items */
                        }

                        .hidden-fields.visible {
                            display: grid; /* Display when visible */
                        }

                        .hidden-item {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
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

                .copy-email {
                    cursor: pointer;
                    color: blue;
                    text-decoration: underline;
                }

                .tags-field {
                    display: flex;
                    flex-direction: row;
                    gap: 0.5rem;
                }
                .tag {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    justify-content: center;
                    color: #AEAEAE;
                    border: 1px solid #AEAEAE;
                    border-radius: 5px;
                    width: fit-content;
                    padding: 0.5rem;
                    font-size: 0.5rem;
                }

                .actions {
                    display: flex;
                    gap:0.3rem;

                    button {
                        padding: 0.5rem;
                        font-family: 'Poppins';
                        border: 0px;
                        background-color: transparent;
                    }

                    button:hover {
                        background-color: rgb(224, 209, 209);
                    }
                }
            }
        }

        .controls {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;

            .shows-rows {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                select {
                    padding: 0.5rem;
				border: 1px solid #c7c7c7;
				border-radius: 6px;
				background-color: #ebeded;
				width: 64px;
				cursor: pointer;
                }
            }

            .pagination {
                display: flex;
                gap: 0.25rem;

                .disabled {
                    opacity: 0.5rem;
                    cursor: not-allowed;
                }
            }

            .page-number {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 5px;
                background-color: transparent;
                border: 1px #a5c9d4 solid;
                color: inherit;

                &:hover {
                    background-color: #ebeded;
                }
            }

            .page-number.current {
                background-color: #a5c9d4;
                color: #151d23;
                width: 40px;
                height: 40px;
            }
        }
    }
</style>