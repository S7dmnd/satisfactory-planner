import { getSingleItem, updateItem, deleteItem } from '$lib/server/crud.js';

export async function GET(event) {
	return await getSingleItem({
		params: event.params,
		tableName: 'FACTORYLIST',
		idColumn: 'FACTORYID',
	});
}

export async function PUT(event) {
	return await updateItem({
		params: event.params,
		request: event.request,
		tableName: 'FACTORYLIST',
		idColumn: 'FACTORYID',
		columns: ['FACTORYNAME'], // 업데이트할 컬럼명 배열
	});
}

export async function DELETE(event) {
	return await deleteItem({
		params: event.params,
		tableName: 'FACTORYLIST',
		idColumn: 'FACTORYID',
	});
}