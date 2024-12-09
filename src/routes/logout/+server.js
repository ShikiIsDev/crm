// src/routes/api/logout.js

import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public'

export async function post({ request }) {
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  // Perform logout
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      status: 500,
      body: { error: 'Failed to log out' }
    }
  }

  // Redirect or return a success response
  return {
    status: 200,
    body: { message: 'Logged out successfully' }
  }
}
