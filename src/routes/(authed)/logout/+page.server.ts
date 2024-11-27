import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	cookies.delete('logged_in', { path: '/' });
	redirect(303, '/');
}
