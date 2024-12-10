import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    const { session } = await locals.safeGetSession();
  
    if (!session) {
      throw redirect(303, '/auth'); // Redirect to login page if no session
    }
  
    return { session };
  }
  