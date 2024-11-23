// src/routes/your-route/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
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


	return { factoryList: factoryList, receiptList: receiptList };
};
