<script>
    let { data } = $props()
    let { supabase } = $derived(data)
  
    const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      }
    }
  </script>
  
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
    <button onclick={logout}>Logout</button>
  </header>