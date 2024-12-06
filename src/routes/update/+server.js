import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

export async function POST( { request }) {
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