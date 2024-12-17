<script>
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import Icon from '@iconify/svelte';

    export let data; // Received from the server load function
    let chartInstance; // To manage the Chart.js instance
    let chartContainer;
    let selectedField = "builtsearchUrl"; // Default field
    let filteredData = data.data; // Dynamic data for the table

    let showRows = 10;
    let currentPage = 1;
    let totalPages = Math.ceil(data.data.length / showRows);

    let displayedData = [];

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

    let selectedBar = null;

    // function handleShowRowsChange(event) {
    //     showRows = parseInt(event.target.value);
    //     totalPages = Math.ceil(rows.length / showRows);
    //     console.log(totalPages)
    //     currentPage = 1;
    //     updateTableData();
    // }

    // function updateTableData() {
    //     const start = (currentPage - 1) * showRows;
    //     const end = start + showRows;
    //     displayedData = rows.slice(start, end);
    //     data.data = displayedData;
    //     console.log(displayedData)
    // }

    // function nextPage() {
    //     if (currentPage < totalPages) {
    //         currentPage++;
    //         updateTableData();
    //         console.log(currentPage)
    //     }
    // }

    // function previousPage() {
    //     if (currentPage > 1) {
    //         currentPage--;
    //         updateTableData();
    //         console.log(currentPage)
    //     }
    // }

    // List of fields to choose from

    const visibleFields = ["company_name", "email","contact", "first_name", "last_name", "tags"]; 

    const fields = [
        { value: "company_name", label: "Company Name" },
        { value: "email", label: "Email" },
        { value: "contact", label: "Contact No." },
        { value: "first_name", label: "First Name" },
        { value: "last_name", label: "Last Name" },
        { value: "tags", label: "Tags" },
        { value: "country", label: "Country" },
        { value: "website", label:"Website" },
        { value: "facebook", label:"Facebook" },
        { value: "instagram", label:"Instagram" },
        { value: "whatsapps", label:"Whatsapp" },
        { value: "company_reg", label:"Company Reg." },
        { value: "pspc_cat", label:"PSPC Category" },
        { value:"builtsearchUrl", label:"BuiltSearch URL"}
    ];

    // Process data to create different charts for specific fields like "country" and "tags"
    function processData() {
    let chartData = { labels: [], data: [] };

    const actualData = data.data; // Access the actual data array
    if (Array.isArray(actualData)) {
        if (selectedField === "country") {
            const countryCount = {};
            actualData.forEach((record) => {
                const country = record[selectedField];
                if (country) {
                    countryCount[country] = (countryCount[country] || 0) + 1;
                }
            });
            chartData.labels = Object.keys(countryCount);
            chartData.data = Object.values(countryCount);
        } else if (selectedField === "tags") {
            const tagCount = {};
            actualData.forEach((record) => {
                const tags = record[selectedField];
                if (tags) {
                    const tagList = Array.isArray(tags) ? tags : tags.split(",");
                    tagList.forEach((tag) => {
                        tag = tag.trim();
                        tagCount[tag] = (tagCount[tag] || 0) + 1;
                    });
                } else {
                    tagCount["Empty Field"] = (tagCount["Empty Field"] || 0) + 1;
                }
            });
            chartData.labels = Object.keys(tagCount);
            chartData.data = Object.values(tagCount);
        } else {
            const filledCount = actualData.filter(record => record[selectedField]);
            chartData.labels = ["Filled Fields", "Empty Fields"];
            chartData.data = [filledCount.length, actualData.length - filledCount.length];
        }
    }

    return chartData;
}

// Function to filter table data based on the clicked bar's label
function filterTableData(clickedLabel) {
    if (selectedField === "country" || selectedField === "tags") {
        filteredData = data.data.filter((record) => {
            const fieldValue = record[selectedField];
            if (selectedField === "tags") {
                const tagList = Array.isArray(fieldValue) ? fieldValue : (fieldValue || "").split(",");
                return tagList.map(tag => tag.trim()).includes(clickedLabel);
            }
            return fieldValue === clickedLabel;
        });
    }

    if (filteredData.length === 0) {
        filteredData = [{ [selectedField]: "No matching rows found" }];
    }
}

// Update chart data and allow clicks on bars
function updateChartData() {
    if (chartInstance) {
        const chartData = processData();
        chartInstance.data.labels = chartData.labels;
        chartInstance.data.datasets[0].data = chartData.data;
        chartInstance.update();
    }

    filteredData = data.data.filter(record => !record[selectedField]);
    if (filteredData.length === 0) {
        filteredData = [{ [selectedField]: "No rows with null or empty values" }];
    }
}

onMount(() => {
    const chartData = processData();

    chartInstance = new Chart(chartContainer, {
        type: "bar",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: `${selectedField} Distribution`,
                    data: chartData.data,
                    backgroundColor: "#4caf50",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedIndex = elements[0].index;
                    const clickedLabel = chartInstance.data.labels[clickedIndex];
                    selectedBar = clickedLabel; // Update the selected bar

                    // Filter table data based on the clicked bar
                    filterTableData(clickedLabel);
                }
            },
        },
    });
});
</script>

<style lang="scss">
    .chart-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
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

    .empty {
        color: red;
    }

    select {
        margin: 10px 0;
        padding: 5px;
    }

    canvas {
        max-width: 100%; /* Ensures the chart doesn't overflow */
        height: 250px; /* Adjust the chart height */
    }
</style>

<div>
    <h2>Dashboard</h2>

    <!-- Field Selector -->
    <div>
        <label for="field-select">Select Field to Inspect:</label>
        <select id="field-select" bind:value={selectedField} on:change={updateChartData}>
            {#each fields as field}
                <option value={field.value}>{field.label}</option>
            {/each}
        </select>
    </div>

    <!-- Chart -->
    <div class="chart-container">
        <canvas bind:this={chartContainer}></canvas>
    </div>

    <!-- Table -->
   <!-- Table -->
   <table>
    <thead>
        <tr>
            {#if visibleFields.includes("company_name")}
                <th>Company Name</th>
            {/if}
            {#if visibleFields.includes("email")}
                <th>Email</th>
            {/if}
            {#if visibleFields.includes("contact")}
                <th>Contact</th>
            {/if}
            {#if visibleFields.includes("first_name")}
                <th>First Name</th>
            {/if}
            {#if visibleFields.includes("last_name")}
                <th>Last Name</th>
            {/if}
            {#if visibleFields.includes("tags")}
                <th>Tags</th>
            {/if}
            {#if selectedField && !visibleFields.includes(selectedField)}
                <th>{fields.find(f => f.value === selectedField)?.label}</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#each filteredData as record}
            <tr>
                {#if visibleFields.includes("company_name")}
                    <td>{record.company_name || "Empty"}</td>
                {/if}
                {#if visibleFields.includes("email")}
                    <td>{record.email || "Empty"}</td>
                {/if}
                {#if visibleFields.includes("contact")}
                    <td>{record.contact || "Empty"}</td>
                {/if}
                {#if visibleFields.includes("first_name")}
                    <td>{record.first_name || "Empty"}</td>
                {/if}
                {#if visibleFields.includes("last_name")}
                    <td>{record.last_name || "Empty"}</td>
                {/if}
                {#if visibleFields.includes("tags")}
                    <td>{record.tags || "Empty"}</td>
                {/if}
                {#if selectedField && !visibleFields.includes(selectedField)}
                    <td>{record[selectedField] || "Empty"}</td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<!-- <div class="controls">
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

        <button on:click={nextPage} class="page-number" diabled={currentPage === totalPages}>
            <Icon icon="line-md:arrow-small-right" />

        </button>
    </div>
</div> -->

</div>
