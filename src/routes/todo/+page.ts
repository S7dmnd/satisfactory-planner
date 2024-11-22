// src/routes/your-route/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/todo', { method: 'GET' });
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const todos = await response.json();
	return { todos };
};
