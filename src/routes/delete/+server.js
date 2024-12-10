import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
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