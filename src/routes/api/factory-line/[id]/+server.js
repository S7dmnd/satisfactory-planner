import { getSingleItem, updateItem, deleteItem } from '$lib/utils/crud.js';

export async function GET(event) {
    return await getSingleItem({
        params: event.params,
        tableName: 'FACTORYLINE',
        idColumn: 'ROWID',
    });
}

export async function PUT(event) {
    return await updateItem({
        params: event.params,
        request: event.request,
        tableName: 'FACTORYLINE',
        idColumn: 'ROWID',
        columns: ['RECEIPTID', 'LINEAMOUNT', 'TODOAMOUNT', 'FACTORYID', 'EXTRAAMOUNT1', 'EXTRAAMOUNT2'], // 업데이트할 컬럼명 배열
    });
}

export async function DELETE(event) {
    return await deleteItem({
        params: event.params,
        tableName: 'FACTORYLINE',
        idColumn: 'ROWID',
    });
}