import { uploadRecipes } from '$lib/server/crud.js';

export async function POST(event) {
    return await uploadRecipes({
        request: event.request,
    });
}