// src/routes/+page.server.js
export async function load({ locals }) {
    const session = locals.session;

    // Redirect to /login if not logged in
    if (!session) {
        return {
            status: 302,
            redirect: "/login",
        };
    }

    // Redirect logged-in users to a default route (e.g., /crm)
    return {
        status: 302,
        redirect: "/crm",
    };
}
