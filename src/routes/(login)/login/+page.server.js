import { supabase } from "$lib/supabaseServer";

export async function load() {
    const { data, error } = await supabase
        .from('admin')
        .select('*')
        .single();

    if (error || !data) {
        return {
            status: 404,
            error: new Error('Data not found'),
        };
    }
    return data;
}
