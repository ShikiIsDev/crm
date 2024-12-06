export async function load({ locals, route }) {
    if (route.id.startsWith('/(app)') && !locals.session) {
        return {
            status: 302,
            redirect: '/login',
        };
    }
}