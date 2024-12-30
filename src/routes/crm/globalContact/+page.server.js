import { supabase } from "$lib/supabaseServer";

export async function load({ locals }) {

    const session = locals.session;

    if (!session) {
        return {
            status: 302,
            redirect:"/login",
        }
    }

    // console.log('test')
    const { data, error } = await supabase
        .from('global')
        .select('*')
    
    // const { data: fileData, error: fileError } = await supabase
    //     .from('attachments')
    //     .select('*')

    if (error || !data) {
        return {
            status: 404,
            error: new Error('Data not found'),
        };
    }


    return { data, user: session.user };
}