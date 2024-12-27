import { supabase } from "$lib/supabaseServer.js";

export async function DELETE({ request}) {

    const formData = await request.formData();

    const file_path = formData.get("file_path");
    const name = formData.get('name');

    const { error: fileError} = await supabase
        .storage
        .from('attachments')
        .remove(file_path)

    const { error: rowError} = await supabase
        .from('attachments')
        .delete()
        .eq('file_path', file_path)
}

export async function POST({request}) {
    try {
        const formData = await request.formData();
        const file_path = formData.get('file_path');
        const name = formData.get('name');
        const email = formData.get('email');

        const { data, error } = await supabase
            .from('attachments')
            .insert([
                {
                    file_path: file_path,
                    email: email,
                    name: name,
                }
            ])
        if (error) {
            console.log(error)
        }
    } catch (err) {
        console.log(err)
    }
}