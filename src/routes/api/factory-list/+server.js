import { getAllItems } from '$lib/server/crud.js';
import { createFactory } from '$lib/server/crudWithAuth';

export async function GET() {
    return await getAllItems({ tableName: 'FACTORYLIST' });
}

export async function POST(event) {
    return await createFactory({
        request: event.request
    });
}