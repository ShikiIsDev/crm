// src/hooks.server.js
import { supabase } from "$lib/supabaseServer";

export async function handle({ event, resolve }) {
    const { data: session } = await supabase.auth.getSession();
    event.locals.session = session;

    return resolve(event);
}
