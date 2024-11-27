import { validateUserId } from '$lib/server/login';
import { error, fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login'; // JWT 서명 키
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	try {
		// JWT 가져오기
		const token = cookies.get('jwt');

		// JWT 검증
		const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
		console.log(`Decoded userId from JWT: ${decoded.userId}`);

		const isValidUser = await validateUserId(decoded.userId);

		if (!isValidUser) {
			throw new Error('Invalid User ID');
		}

		return {
			userId: decoded.userId,
		};

	} catch (error) {
		console.error(`JWT error: ${error}`);
		redirect(303, `/?redirectTo=${url.pathname}`);
	}
}