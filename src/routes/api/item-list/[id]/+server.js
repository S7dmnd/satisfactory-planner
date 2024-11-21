import { getSingleItem, updateItem, deleteItem } from '$lib/utils/crud.js';

export async function GET(event) {
	return await getSingleItem({
		params: event.params,
		tableName: 'ITEMLIST',
		idColumn: 'ITEMID',
	});
}

export async function PUT(event) {
	return await updateItem({
		params: event.params,
		request: event.request,
		tableName: 'ITEMLIST',
		idColumn: 'ITEMID',
		columns: ['ITEMNAME'], // 업데이트할 컬럼명 배열
	});
}

export async function DELETE(event) {
	return await deleteItem({
		params: event.params,
		tableName: 'ITEMLIST',
		idColumn: 'ITEMID',
	});
}