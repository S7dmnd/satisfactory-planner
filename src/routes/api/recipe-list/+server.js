import { getAllItems, createItem } from '$lib/server/crud.js';

export async function GET() {
	return await getAllItems({ tableName: 'RECIPELIST' });
}

export async function POST(event) {
	return await createItem({
		request: event.request,
		tableName: 'RECIPELIST',
		columns: ['INITEM1', 'INAMOUNT1', 'INITEM2', 'INAMOUNT2', 'INITEM3', 'INAMOUNT3',
			'INITEM4', 'INAMOUNT4', 'OUTITEM1', 'OUTAMOUNT1', 'OUTITEM2', 'OUTAMOUNT2'
		], // 업데이트할 컬럼명 배열
	});
}