import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: 아마도 쿠키 쓰면 원래 보던 페이지로 돌아갈 수도 있을듯??
	throw redirect(302, '/todo');
};
