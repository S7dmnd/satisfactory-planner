import { getAllItems, createItem } from '$lib/server/crud.js';

export async function GET() {
	return await getAllItems({ tableName: 'DELIVERYLINE' });
}

export async function POST(event) {
	return await createItem({
		request: event.request,
		tableName: 'DELIVERYLINE',
		columns: ['SOURCEID', 'DESTINATIONID', 'ITEMKEY', 'METHOD', 'AMOUNT'], // 필요한 컬럼명 배열
	});
}