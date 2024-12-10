import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

export async function POST( { request }) {
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