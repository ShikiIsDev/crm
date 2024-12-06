import { json } from '@sveltejs/kit';

export async function POST({ request }) {
        try{
            console.log("test")
            const form = await request.formData();
            const enteredPassword = form.get('enteredPassword');
            const enteredUsername = form.get('enteredUsername');
            const correctUsername = form.get('correctUsername');
            const correctPassword = form.get('correctPassword');

            const isMatch =
            enteredUsername === correctUsername &&
            enteredPassword === correctPassword;


            if (isMatch) {
                return json({ message: 'Correct password'}, { status: 200 });
            } else {
                return json({ message: 'Incorrect password'}, { status: 401});
            }

        } catch (error) {
            return json({ error: error.message }, { status: 500 });
        }
}