import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

function capitalizeWords(string) {
  return string
      .toLowerCase() // Convert the entire string to lowercase
      .split(" ") // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back into a single string
}

export async function POST({ request }) {
  try {
      console.log('post');
      const formData = await request.formData();
      const company_name = formData.get("company_name");
      const email = formData.get("email");
      const first_name = capitalizeWords(formData.get("first_name"));
      const last_name = capitalizeWords(formData.get("last_name"));
      const tags = formData.get("tags");
      const whatsapps = formData.get("whatsapps");
      const contact = formData.get("contact"); // Corrected key name
      const country = formData.get("country");
      const company_reg = formData.get("company_reg"); // Corrected key name
      const website = formData.get("website");
      const pspc_cat = formData.get("pspc_category");
      const instagram = formData.get("instagram");
      const facebook = formData.get("facebook");
      const builtsearchUrl = formData.get("builtsearch_url");
      const remarks = formData.get("remarks");
      const pdpa = formData.get("pdpa");
      
      // Insert the row into Supabase
      const { data: insertedData, error: insertError } = await supabase
          .from('contacts')
          .insert([{
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
              remarks: remarks,
              pdpa: pdpa
          }]);
      
      if (insertError) throw new Error(insertError.message);
      
      console.log(insertedData);

      return json({ success: true, message: 'Row inserted successfully' });
  } catch (err) {
      console.error('Error:', err);
      return json({ success: false, message: err.message || 'An error occurred' }, { status: 500 });
  }
}


// export async function DELETE({ request }) {
//     const row = await request.formData();
//     const email = row.get('email');
//     console.log("deletetest")

//     try {
//         // Step 1: Delete the row from the database
//         const { data, error } = await supabase
//             .from('contacts') // Replace 'contacts' with your table name
//             .delete()
//             .eq('email', email); // Assuming each row has a unique 'id' field

//         if (error) {
//             console.error("Error deleting row:", error);
            
//         }

//     } catch (error) {
//         console.error("Unexpected error:", error);
//     }
// }

export async function DELETE({ request }) {
    const formData = await request.formData();
    const emails = formData.getAll('emails[]'); // Get an array of emails
    console.log("Deleting emails:", emails);
  
    try {
      const { data, error } = await supabase
        .from('contacts')
        .delete()
        .in('email', emails); // Use 'in' to delete multiple rows
  
      if (error) {
        console.error("Error deleting rows:", error);
        return new Response("Error deleting rows", { status: 500 });
      }
  
      return new Response("Rows deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Unexpected error:", error);
      return new Response("Unexpected error", { status: 500 });
    }
  }

export async function PUT( { request }) {
    try {
        const formData = await request.formData();
        const company_name = formData.get("company_name");
        const email = formData.get("email");
        const first_name = capitalizeWords(formData.get("first_name"));
        const last_name = capitalizeWords(formData.get("last_name"));
        const tags = formData.get("tags");
        const whatsapps = formData.get("whatsapps");
        const contact = formData.get("contact_no"); // Corrected key name
        const country = formData.get("country");
        const company_reg = formData.get("company_reg"); // Corrected key name
        const website = formData.get("website");
        const pspc_cat = formData.get("pspc_category");
        const instagram = formData.get("instagram");
        const facebook = formData.get("facebook");
        const builtsearchUrl = formData.get("builtsearch_url");
        const remarks = formData.get("remarks");
        const pdpa = formData.get("pdpa");
        const date_modified = new Date().toISOString();
        console.log(date_modified)
        
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
                    date_modified: new Date().toISOString(),
                    last_modified: new Date().toISOString(),
                    remarks: remarks,
                    pdpa: pdpa,
            })
            .eq('email',email);

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
        const first_name = capitalizeWords(row['first_name']);
        const last_name = capitalizeWords(row['last_name']);
        const tags = row['tags'];
        const whatsapps = row['whatsapps'];
        const contact = row['contact'];
        const country = row['country'];
        const company_reg = row['company_reg'];
        const website = row['website'];
        const pspc_cat = row['pspc_cat'];
        const instagram = row['instagram'];
        const facebook = row['facebook'];
        const builtsearchUrl = row['builtsearchUrl'];
        const remarks = row['remarks'];
        const pdpa = row['pdpa'];
        

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
                builtsearchUrl,
                date_modified: new Date().toISOString(),
                last_modified: new Date().toISOString(),
                remarks,
                pdpa,
            })
            .eq('email',email);

            if (updateError) {
                throw new Error(updateError.message);
            }

            return json({ success: true, message: `Company "${company_name}" updated successfully.` });
    } catch (error) {
        console.error('Error:', error.message || error);
        return json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}