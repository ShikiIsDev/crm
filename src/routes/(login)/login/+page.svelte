<!-- src/routes/login/+page.svelte -->
<script>
    import { supabase } from "$lib/supabaseClient";

    let email = "";
    let password = "";

    async function login() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login failed:", error.message);
        } else {
            // Redirect to /crm after login
            window.location.href = "/crm";
        }
    }
</script>

<form on:submit|preventDefault={login}>
    <label>Email:</label>
    <input type="email" bind:value={email} required />

    <label>Password:</label>
    <input type="password" bind:value={password} required />

    <button type="submit">Login</button>
</form>
