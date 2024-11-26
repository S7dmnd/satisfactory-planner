// src/routes/edit/[[id]]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const { id } = params;
	const rowFrame = {
		ROWID: parseInt(id) ?? null,
		FACTORYID: null,
		RECIPEKEY: null,
		LINEAMOUNT: 0,
		TODOAMOUNT: 0,
	};

	const factoryResponse = await fetch('/api/factory-list', { method: 'GET' });
	if (!factoryResponse.ok) {
		throw new Error(`HTTP error! status: ${factoryResponse.status}`);
	}
	const factoryList = await factoryResponse.json();

	const recipeResponse = await fetch('/api/recipe-view', { method: 'GET' });
	if (!recipeResponse.ok) {
		throw new Error(`HTTP error! status: ${recipeResponse.status}`);
	}
	const recipeList = await recipeResponse.json();

	if (id) {
		const rowResponse = await fetch(`/api/factory-line/${id}`);
		if (!rowResponse.ok) {
			throw new Error(`HTTP error! status: ${rowResponse.status}`);
		}
		const row = await rowResponse.json();
		rowFrame.FACTORYID = row.FACTORYID;
		rowFrame.RECIPEKEY = row.RECIPEKEY;
		rowFrame.LINEAMOUNT = row.LINEAMOUNT;
		rowFrame.TODOAMOUNT = row.TODOAMOUNT;
	};

	return { factoryList: factoryList, recipeList: recipeList, rowFrame: rowFrame };
};
