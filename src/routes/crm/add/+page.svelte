<script>
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent page reload on form submission

        const form = event.target; // Get the form element
        const formData = new FormData(form); // Create FormData object from the form

        try {
            // Make the API call
            const response = await fetch('/crm', { // Replace with the actual endpoint
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Success: ${result.message}`);
                history.back(); // Redirect to the previous page
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
    <div class="form">
        <p>test</p>
        <h1>Update Row</h1>
        <form on:submit={handleSubmit}>
            <label for="company_name">Company Name</label>
            <input type="text" name="company_name" required />

            <label for="email">Email</label>
            <input type="email" name="email" />

            <label for="first_name">First Name</label>
            <input type="text" name="first_name" />

            <label for="last_name">Last Name</label>
            <input type="text" name="last_name" />

            <label for="tags">Tags</label>
            <input type="text" name="tags" />

            <label for="whatsapps">Whatsapps</label>
            <input type="text" name="whatsapps" />

            <label for="contact_no">Contact No.</label>
            <input type="text" name="contact_no" />

            <label for="country">Country</label>
            <input type="text" name="country" />

            <label for="company_reg._no.">Company Reg.</label>
            <input type="text" name="company_reg._no." />

            <label for="website">Website</label>
            <input type="text" name="website" />

            <label for="pspc_category">PSPC Category</label>
            <input type="text" name="pspc_category" />

            <label for="instagram">Instagram</label>
            <input type="text" name="instagram" />

            <label for="facebook">Facebook</label>
            <input type="text" name="facebook" />

            <label for="builtsearch_url">BuiltSearch URL</label>
            <input type="text" name="builtsearch_url" />

            <button type="submit">Submit</button>
        </form>
    </div>
</div>

<style>
    .body {
        font-family: 'Poppins';
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 1.5rem;
        max-width: 500px;
        margin: auto;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button {
        background-color: #007bff;
        padding: 0.5rem;
        color: white;
        border: 0px;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0a77ec;
    }
</style>
