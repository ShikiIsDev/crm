<script>
    import { goto } from '$app/navigation';
    export let data;
    import MultiSelect from "svelte-multiselect";
    let selectedCountryCode = '';
    let selectedTags = [];

    let selectedCountry = '';

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


    async function handleSubmit(event) {
        

        const form = event.target; // Get the form element
        const formData = new FormData(form); // Create FormData object from the form

        const contact_no = `${selectedCountryCode}${formData.get('contact_no')}`;
        const whatsapps = `${selectedCountryCode}${formData.get('whatsapps')}`;
        const tags = selectedTags.map((obj) => {
            return obj.value;
        })
        formData.set('contact_no', contact_no);
        formData.set('whatsapps', whatsapps);
        formData.set('tags',tags);

        try {
            // Make the API call
            const response = await fetch('/crm', { // Replace with the actual endpoint
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Success: ${result.message}`);
                goto('/crm')
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }
</script>


<div class="body">
    <div class="form-card">
        <h1>Add Row</h1>
        <form on:submit={handleSubmit}>
            <div class="form-group">
                <label for="company_name">Company Name</label>
                <input type="text" name="company_name" />
            </div>

            <div class="form-group">
                <label for="email">Email (required)</label>
                <input type="email" name="email" required />
            </div>

            <div class="form-group">
                <label for="first_name">First Name (required)</label>
                <input type="text" name="first_name" required />
            </div>

            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input type="text" name="last_name" />
            </div>

            <div class="form-group">
                <label for="tags">Tags</label>
                <MultiSelect
                    bind:selected={selectedTags}
                    placeholder="Select Tags"
                    options={tags} />
            </div>

            <div class="form-group">
                <label for="contact_no">Contact No.</label>
                <div class="input-group">
                    <select 
                        name="country_code" 
                        bind:value={selectedCountryCode} 
                        
                    >
                        <option value="" disabled selected>Select Country Code</option>
                        {#each data.countryCodes as { value, label }}
                            <option value={value}>{label}</option>
                        {/each}
                    </select>
                    <input 
                        type="text" 
                        name="contact_no" 
                        placeholder="Your number" 
                        
                    />
                </div>
            </div>

            <div class="form-group">
                <label for="whatsapps">Whatsapps</label>
                <div class="input-group">
                    <select 
                        name="country_code" 
                        bind:value={selectedCountryCode} 
                        
                    >
                        <option value="" disabled selected>Select Country Code</option>
                        {#each data.countryCodes as { value, label }}
                            <option value={value}>{label}</option>
                        {/each}
                    </select>
                    <input 
                        type="text" 
                        name="whatsapps" 
                        placeholder="Whatsapps number" 
                        
                    />
                </div>
            </div>

            <div class="form-group">
                <label for="country">Country</label>
                <div class="input-group">
                    <select 
                        name="country" 
                        bind:value={selectedCountry} 
                        
                    >
                        <option value="" disabled selected>Select Country</option>
                        {#each data.countryNames as { name }}
                            <option value={name}>{name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="company_reg._no.">Company Reg.</label>
                <input type="text" name="company_reg._no." />
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

            <button type="submit">Submit</button>
        </form>
    </div>
</div>

<style>
    .body {
        font-family: 'Poppins';
        background-color: #f9fafc;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
    }

    .body {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        width: 100%;
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

    form {
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

    input, select {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        width: 100%;
    }

    input:focus, select:focus {
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

