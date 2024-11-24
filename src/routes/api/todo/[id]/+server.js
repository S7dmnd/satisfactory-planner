import { updateTodo } from '$lib/server/crud.js';

export async function PUT(event) {
    return await updateTodo({
        params: event.params
    });
}