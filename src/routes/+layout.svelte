<script>
    import { invalidate } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    
    export let data = { session: null, supabase: null }; // Fallback for safety
    export let children;  // Declare children as a prop
    let { session, supabase } = data;
  
    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
        if (newSession?.expires_at !== session?.expires_at) {
          invalidate('supabase:auth')
        }
      })
  
      return () => data.subscription.unsubscribe()
    });
  </script>
  
  <main>
    <!-- Render children manually -->
    <slot/>
  </main>
  