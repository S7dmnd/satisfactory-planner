import { getAllItems, createItem } from '$lib/server/crud.js';

export async function GET() {
	return await getAllItems({ tableName: 'ITEMLIST' });
}

export async function POST(event) {
	return await createItem({
		request: event.request,
		tableName: 'ITEMLIST',
		columns: ['ITEMNAME'], // 필요한 컬럼명 배열
	});
}