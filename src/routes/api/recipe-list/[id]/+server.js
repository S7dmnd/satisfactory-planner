import { getSingleItem, updateItem, deleteItem } from '$lib/server/crud.js';

export async function GET(event) {
	return await getSingleItem({
		params: event.params,
		tableName: 'RECIPELIST',
		idColumn: 'RECIPEKEY',
	});
}

export async function PUT(event) {
	return await updateItem({
		params: event.params,
		request: event.request,
		tableName: 'RECIPELIST',
		idColumn: 'RECIPEKEY',
		columns: ['INITEM1', 'INAMOUNT1', 'INITEM2', 'INAMOUNT2', 'INITEM3', 'INAMOUNT3',
			'INITEM4', 'INAMOUNT4', 'OUTITEM1', 'OUTAMOUNT1', 'OUTITEM2', 'OUTAMOUNT2'
		], // 업데이트할 컬럼명 배열
	});
}

export async function DELETE(event) {
	return await deleteItem({
		params: event.params,
		tableName: 'RECIPELIST',
		idColumn: 'RECIPEKEY',
	});
}