import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	cookies.set('jwt', 'invalidtoken', { path: '/' });
	redirect(303, '/');
}
