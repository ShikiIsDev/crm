import { supabase } from "$lib/supabaseServer";
import { redirect } from "@sveltejs/kit";

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
        .from('contacts')
        .select('*')

    if (error || !data) {
        return {
            status: 404,
            error: new Error('Data not found'),
        };
    }

    // console.log(error);
    // console.log(data)

    return { data, user: session.user };
}