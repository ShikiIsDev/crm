import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const load = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, { global: { fetch } })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        global: { fetch },
        cookies: {
          getAll: () => data.cookies || [],
        },
      });

  let session = null;
  let user = null;

  try {
    const sessionResponse = await supabase.auth.getSession();
    session = sessionResponse.data.session;
  } catch (error) {
    console.error('Error fetching session:', error);
  }

  try {
    const userResponse = await supabase.auth.getUser();
    user = userResponse.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  console.log('Is browser:', isBrowser());
  console.log('Session:', session);
  console.log('User:', user);

  return { session, supabase, user };
};
