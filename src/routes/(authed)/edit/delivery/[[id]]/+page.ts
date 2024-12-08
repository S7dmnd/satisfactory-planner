// src/routes/edit/[[id]]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	return { factoryList: data.factoryList, itemList: data.itemList, rowFrame: data.rowFrame, userId: data.userId };
};
