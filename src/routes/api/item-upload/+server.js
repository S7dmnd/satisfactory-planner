import { uploadItems } from '$lib/server/crud.js';

export async function POST(event) {
    return await uploadItems({
        request: event.request,
    });
}