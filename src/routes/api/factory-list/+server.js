import { getAllItems, createItem } from '$lib/server/crud.js';

export async function GET() {
	return await getAllItems({ tableName: 'FACTORYLIST' });
}

export async function POST(event) {
	return await createItem({
		request: event.request,
		tableName: 'FACTORYLIST',
		columns: ['FACTORYNAME'], // 필요한 컬럼명 배열
	});
}