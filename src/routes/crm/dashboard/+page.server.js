import { supabase } from "$lib/supabaseServer";
import { redirect } from "@sveltejs/kit";

function cleanTags(tags, availableTags) {
    if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    return tags
        .map(tag => {
            const cleanedTag = tag.replace(/[_|,]+/g, ''); // Clean underscores and commas
            const matchedTag = availableTags.find(t => t.value.toLowerCase() === cleanedTag);
            return matchedTag ? matchedTag.label : null;
        })
        .filter(tag => tag)  // Filter out any null values
        .join(', ');
}

export async function load({ locals }) {

    const session = locals.session;

    if (!session) {
        return {
            status: 302,
            redirect:"/login",
        }
    }

    // console.log('test')
    const { data, error } = await supabase
        .from('contacts')
        .select('*')

    if (error || !data) {
        return {
            status: 404,
            error: new Error('Data not found'),
        };
    }

    // const availableTags = [
    //     { value: "architect", label: "Architect"},
    //     { value: "interior designer", label: "Interior Designer"},
    //     { value: "cs engineer", label: "CS Engineer"},
    //     { value: "mep engineer", label: "MEP Engineer"},
    //     { value: "facility management", label: "Facility Management"},
    //     { value: "quantity surveyor", label: "Quantity Surveyor"},
    //     { value: "project management", label: "Project Management"},
    //     { value: "owner", label: "Owner"},
    //     { value: "agencies", label: "Agencies"},
    //     { value: "supplier", label: "Supplier"}
    // ];

    // const cleanedData = data.map(contact => ({
    //     ...contact,
    //     cleanedTags: contact.tag ? cleanTags(contact.tag, availableTags) : "", // Only clean if tag exists
    // }));

    // console.log(data);
    console.log(error);

    return { data, user: session.user };
}