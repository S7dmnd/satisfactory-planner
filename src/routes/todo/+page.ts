import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// const response = await fetch('/api/todos');
	// const data = await response.json();
	const data = [
		'본공장',
		'뒷공장',
		'앞공장'
	];

	// 정확히는 data가 아니라 data.factories나 getFactories(data)일듯
	return { factories: data };
};