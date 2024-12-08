// src/routes/edit/[[id]]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {

	const recipeResponse = await fetch('/api/recipe-view', { method: 'GET' });
	if (!recipeResponse.ok) {
		throw new Error(`HTTP error! status: ${recipeResponse.status}`);
	}
	const recipeList = await recipeResponse.json();

	return { factoryList: data.factoryList, recipeList: recipeList, rowFrame: data.rowFrame, userId: data.userId };
};
