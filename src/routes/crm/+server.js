import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const company_name = formData.get("company_name");
        const email = formData.get("email");
        const first_name = formData.get("first_name");
        const last_name = formData.get("last_name");
        const tags = formData.get("tags");
        const whatsapps = formData.get("whatsapps");
        const contact = formData.get("contact_no"); // Corrected key name
        const country = formData.get("country");
        const company_reg = formData.get("company_reg._no."); // Corrected key name
        const website = formData.get("website");
        const pspc_cat = formData.get("pspc_category");
        const instagram = formData.get("instagram");
        const facebook = formData.get("facebook");
        const builtsearchUrl = formData.get("builtsearch_url");
        
        // Insert the row into Supabase
        const { data: insertedData, error: insertError } = await supabase
            .from('contacts')
            .insert([
               {
                    company_name: company_name,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    tags: tags,
                    whatsapps: whatsapps,
                    contact: contact,
                    country: country,
                    company_reg: company_reg,
                    website: website,
                    pspc_cat: pspc_cat,
                    instagram: instagram,
                    facebook: facebook,
                    builtsearchUrl: builtsearchUrl,
               }
            ]);
        
        console.log(insertedData);

        return json({ success: true, message: 'Row inserted successfully' });
      } catch (err) {
        console.error('Error:', err);
        return json({ success: false, message: err.message || 'An error occurred' }, { status: 500 });
      }
}

export async function DELETE({ request }) {
    const row = await request.formData();
    const email = row.get('email');
    console.log("deletetest")

    try {
        // Step 1: Delete the row from the database
        const { data, error } = await supabase
            .from('contacts') // Replace 'contacts' with your table name
            .delete()
            .eq('email', email); // Assuming each row has a unique 'id' field

        if (error) {
            console.error("Error deleting row:", error);
            
        }

    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

export async function PUT( { request }) {
    try {
        const formData = await request.formData();
        const company_name = formData.get("company_name");
        const email = formData.get("email");
        const first_name = formData.get("first_name");
        const last_name = formData.get("last_name");
        const tags = formData.get("tags");
        const whatsapps = formData.get("whatsapps");
        const contact = formData.get("contact_no"); // Corrected key name
        const country = formData.get("country");
        const company_reg = formData.get("company_reg._no."); // Corrected key name
        const website = formData.get("website");
        const pspc_cat = formData.get("pspc_category");
        const instagram = formData.get("instagram");
        const facebook = formData.get("facebook");
        const builtsearchUrl = formData.get("builtsearch_url");
        
        const { error: updateError } = await supabase
            .from('contacts')
            .update({
                company_name: company_name,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    tags: tags,
                    whatsapps: whatsapps,
                    contact: contact,
                    country: country,
                    company_reg: company_reg,
                    website: website,
                    pspc_cat: pspc_cat,
                    instagram: instagram,
                    facebook: facebook,
                    builtsearchUrl: builtsearchUrl,
            })
            .eq('company_name',company_name);

            if (updateError) {
                throw new Error(updateError.message);
            }

            return json({ success: true, message: `Company "${company_name}" updated successfully.` });
    } catch (error) {
        console.error('Error:', error.message || error);
        return json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}

export async function PATCH( { request }) {
    try {
        const row = await request.json(); // Parse the row data from the request body
        console.log(row);
        
        const company_name = row['company_name'];
        const email = row['email'];
        const first_name = row['first_name'];
        const last_name = row['last_name'];
        const tags = Array.isArray(row['tags']) ? row['tags'] : [row['tags']];
        const whatsapps = row['whatsapps'];
        const contact = row['contact'];
        const country = row['country'];
        const company_reg = row['company_reg'];
        const website = row['website'];
        const pspc_cat = row['pspc_cat'];
        const instagram = row['instagram'];
        const facebook = row['facebook'];
        const builtsearchUrl = row['builtsearchUrl'];

        const { error: updateError } = await supabase
            .from('contacts')
            .update({
                email,
                first_name,
                last_name,
                tags,
                whatsapps,
                contact,
                country,
                company_reg,
                website,
                pspc_cat,
                instagram,
                facebook,
                builtsearchUrl
            })
            .eq('company_name',company_name);

            if (updateError) {
                throw new Error(updateError.message);
            }

            return json({ success: true, message: `Company "${company_name}" updated successfully.` });
    } catch (error) {
        console.error('Error:', error.message || error);
        return json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}