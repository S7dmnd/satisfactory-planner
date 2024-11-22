import { getAllItems } from '$lib/server/crud.js';

export async function GET() {
    return await getAllItems({ tableName: 'RECEIPTVIEW' });
}