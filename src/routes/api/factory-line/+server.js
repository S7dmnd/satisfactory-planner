import { getAllItems, createItem } from '$lib/utils/crud.js';

export async function GET() {
	return await getAllItems({ tableName: 'FACTORYLINE' });
}

export async function POST(event) {
	return await createItem({
		request: event.request,
		tableName: 'FACTORYLINE',
		columns: ['RECEIPTID', 'LINEAMOUNT', 'TODOAMOUNT', 'FACTORYID', 'EXTRAAMOUNT1', 'EXTRAAMOUNT2'], // 필요한 컬럼명 배열
	});
}