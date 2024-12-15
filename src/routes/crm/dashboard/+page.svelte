<script>
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import Icon from '@iconify/svelte';

    export let data; // Received from the server load function
    let chartInstance; // To manage the Chart.js instance
    let chartContainer;
    let selectedField = "tags"; // Default field
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
    let fields = [
        "company_name", "email", "first_name", "last_name", "tags",
        "whatsapps", "contact", "country", "company_reg", "website",
        "pspc_cat", "instagram", "facebook", "builtsearchUrl"
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

    // Function to update chart data and filter table data
    function updateChartData() {
    // Update chart
    if (chartInstance) {
        const chartData = processData();
        chartInstance.data.labels = chartData.labels;
        chartInstance.data.datasets[0].data = chartData.data;

        chartInstance.update();
    }

    // Filter table data for null or empty rows
    filteredData = data.data.filter(record => {
        const fieldValue = record[selectedField];
        if (Array.isArray(fieldValue)) {
            // Check for empty arrays
            return fieldValue.length === 0;
        }
        return !fieldValue || fieldValue === ""; // Null, undefined, or empty strings
    });

    // If no rows match, show a placeholder message
    if (filteredData.length === 0) {
        filteredData = [{ [selectedField]: "No rows with null or empty values" }];
    }
}



    // Initialize the chart in onMount
    onMount(() => {
        const chartData = processData(); // Get initial data

        chartInstance = new Chart(chartContainer, {
            type: "bar",
            data: {
                labels: chartData.labels, // Dynamic labels
                datasets: [
                    {
                        label: `${selectedField.charAt(0).toUpperCase() + selectedField.slice(1)} Distribution`,
                        data: chartData.data, // Dynamic data
                        backgroundColor: "#4caf50",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                maintainAspectRatio: false
            },
        });

        return () => {
            // Clean up chart instance on destroy
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        };
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
                <option value={field}>{field}</option>
            {/each}
        </select>
    </div>

    <!-- Chart -->
    <div class="chart-container">
        <canvas bind:this={chartContainer}></canvas>
    </div>

    <!-- Table -->
   <!-- Table -->
<table class="table">
    <thead>
        <tr>
            <th>
                <div class="header-content">
                    <span>Company Name</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Email</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>First Name</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Last Name</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Tags</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Whatsapps</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Contact</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Country</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Company Reg</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Website</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>PSPC Category</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Instagram</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>Facebook</span>
                </div>
            </th>
            <th>
                <div class="header-content">
                    <span>BuiltSearch URL</span>
                </div>
            </th>
        </tr>
    </thead>
    <tbody>
        {#each filteredData as record}
            <tr>
                <td class="{record.company_name ? '' : 'empty'}">{record.company_name || "Empty"}</td>
                <td class="{record.email ? '' : 'empty'}">{record.email || "Empty"}</td>
                <td class="{record.first_name ? '' : 'empty'}">{record.first_name || "Empty"}</td>
                <td class="{record.last_name ? '' : 'empty'}">{record.last_name || "Empty"}</td>
                <td>
                    <div class="tags-field">
                        {#if record.tags}
                            {#each record.tags.split(",") as tag}
                                <span class="tag">{tag.trim()}</span>
                            {/each}
                        {:else}
                            <span class="empty">Empty</span>
                        {/if}
                    </div>
                </td>
                <td class="{record.whatsapps ? '' : 'empty'}">{record.whatsapps || "Empty"}</td>
                <td class="{record.contact ? '' : 'empty'}">{record.contact || "Empty"}</td>
                <td class="{record.country ? '' : 'empty'}">{record.country || "Empty"}</td>
                <td class="{record.company_reg ? '' : 'empty'}">{record.company_reg || "Empty"}</td>
                <td class="{record.website ? '' : 'empty'}">{record.website || "Empty"}</td>
                <td class="{record.pspc_cat ? '' : 'empty'}">{record.pspc_cat || "Empty"}</td>
                <td class="{record.instagram ? '' : 'empty'}">{record.instagram || "Empty"}</td>
                <td class="{record.facebook ? '' : 'empty'}">{record.facebook || "Empty"}</td>
                <td class="{record.builtsearchUrl ? '' : 'empty'}">{record.builtsearchUrl || "Empty"}</td>
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
