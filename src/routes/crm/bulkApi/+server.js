import { supabase } from "$lib/supabaseServer";
import { json } from "@sveltejs/kit";

function capitalizeWords(string) {
  return string
      .toLowerCase() // Convert the entire string to lowercase
      .split(" ") // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back into a single string
}

export async function PATCH({ request }) {
    try {
        const formData = await request.formData();
        const email = formData.get("email");
        const newTag = formData.get("tags"); // New tag to add
        const date_modified = new Date().toISOString();

        if (!email || !newTag) {
            throw new Error("Email and tag are required.");
        }

        // Fetch the current tags for the specified email
        const { data: existingData, error: fetchError } = await supabase
            .from('contacts')
            .select('tags')
            .eq('email', email)
            .single();

        if (fetchError) {
            throw new Error(`Error fetching existing tags: ${fetchError.message}`);
        }

        // Parse current tags and append the new tag
        let currentTags = existingData?.tags || [];
        if (typeof currentTags === 'string') {
            currentTags = currentTags.split(',').map(tag => tag.trim());
        }

        if (!currentTags.includes(newTag)) {
            currentTags.push(newTag);
        }

        // Update the database with the new tags
        const { error: updateError } = await supabase
            .from('contacts')
            .update({
                tags: currentTags.join(', '), // Save tags as a comma-separated string
                date_modified,
                last_modified: date_modified,
            })
            .eq('email', email);

        if (updateError) {
            throw new Error(`Error updating tags: ${updateError.message}`);
        }

        return json({ success: true, message: `Tag "${newTag}" added successfully.` });
    } catch (error) {
        console.error('Error:', error.message || error);
        return json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}
