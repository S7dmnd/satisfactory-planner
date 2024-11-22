import { getSingleItem, updateItem, deleteItem } from '$lib/server/crud.js';

export async function GET(event) {
	return await getSingleItem({
		params: event.params,
		tableName: 'DELIVERYLINE',
		idColumn: 'DELIVERYID',
	});
}

export async function PUT(event) {
	return await updateItem({
		params: event.params,
		request: event.request,
		tableName: 'DELIVERYLINE',
		idColumn: 'DELIVERYID',
		columns: ['SOURCEID', 'DESTINATIONID', 'ITEMID', 'METHOD', 'AMOUNT'], // 업데이트할 컬럼명 배열
	});
}

export async function DELETE(event) {
	return await deleteItem({
		params: event.params,
		tableName: 'DELIVERYLINE',
		idColumn: 'DELIVERYID',
	});
}