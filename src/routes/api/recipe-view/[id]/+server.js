import { getSingleItem } from '$lib/server/crud.js';

export async function GET(event) {
    return await getSingleItem({
        params: event.params,
        tableName: 'RECIPEVIEW',
        idColumn: 'RECIPEKEY',
    });
}