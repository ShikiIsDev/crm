import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public'

const supabase = async ({ event, resolve }) => {
    // console.log('Supabase middleware triggered');
    // console.log('Cookies at start:', event.cookies.getAll());
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        // console.log('Setting cookies:', cookiesToSet);
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    // console.log('Fetching session and user...');
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
        // console.log('No session found');
        return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
        console.error('Error fetching user:', error);
        return { session: null, user: null }
    }

    // console.log('Session and user fetched successfully:', session, user);
    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
        // console.log('Filtering response headers:', name);
        return name === 'content-range' || name === 'x-supabase-api-version'
    },
  });
};

const authGuard = async ({ event, resolve }) => {
    // console.log('Auth guard triggered');
    const { session, user } = await event.locals.safeGetSession()
    // console.log('Session:', session);
    // console.log('User:', user);

    if (event.url.pathname === '/') {
      return redirect(303, '/auth');
    }

    event.locals.session = session;
    event.locals.user = user;
  
    if (!event.locals.session && event.url.pathname.startsWith('/crm')) {
        return redirect(303, '/auth');
    }
  
    if (event.locals.session && event.url.pathname === '/auth') {
        return redirect(303, '/crm');
    }
  
    return resolve(event);
  }

export const handle = sequence(supabase, authGuard)
