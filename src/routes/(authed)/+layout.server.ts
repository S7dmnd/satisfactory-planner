import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, url }) => {
	if (!cookies.get('logged_in')) {
		redirect(303, `/?redirectTo=${url.pathname}`);
	}
}