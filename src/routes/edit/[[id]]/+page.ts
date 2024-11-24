// src/routes/edit/[[id]]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const { id } = params;
	const rowFrame = {
		FACTORYID: null,
		RECEIPTID: null,
		LINEAMOUNT: '',
		TODOAMOUNT: '',
	};

	const factoryResponse = await fetch('/api/factory-list', { method: 'GET' });
	if (!factoryResponse.ok) {
		throw new Error(`HTTP error! status: ${factoryResponse.status}`);
	}
	const factoryList = await factoryResponse.json();

	const receiptResponse = await fetch('/api/receipt-view', { method: 'GET' });
	if (!receiptResponse.ok) {
		throw new Error(`HTTP error! status: ${receiptResponse.status}`);
	}
	const receiptList = await receiptResponse.json();

	if (id) {
		const rowResponse = await fetch(`/api/factory-line/${id}`);
		if (!rowResponse.ok) {
			throw new Error(`HTTP error! status: ${rowResponse.status}`);
		}
		const row = await rowResponse.json();
		rowFrame.FACTORYID = parseInt(row.FACTORYID);
		rowFrame.RECEIPTID = parseInt(row.RECEIPTID);
		rowFrame.LINEAMOUNT = row.LINEAMOUNT;
		rowFrame.TODOAMOUNT = row.TODOAMOUNT;
	};

	return { factoryList: factoryList, receiptList: receiptList, rowFrame: rowFrame };
};
