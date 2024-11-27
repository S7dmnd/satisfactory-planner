import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Form Action
// +page.svelte에서 method="POST"로 지정된 form 제출 시 실행되는 함수
export const actions = {
	default: ({ cookies, url }) => {
		cookies.set('logged_in', 'true', { path: '/' });
		redirect(303, url.searchParams.get('redirectTo') ?? '/factory-line');
	}
};

export const load: PageServerLoad = ({ cookies, url }) => {
	if (cookies.get('logged_in')) {
		redirect(303, url.searchParams.get('redirectTo') ?? '/factory-line');
	}
}