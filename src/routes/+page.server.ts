import { login, validateUserId } from '$lib/server/login';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$lib/server/login'; // JWT 서명 키

// Form Action
// +page.svelte에서 method="POST"로 지정된 form 제출 시 실행되는 함수

export const actions = {
	default: async ({ request, cookies, url }) => {
		try {
			// Form 데이터 파싱
			const formData = await request.formData();
			const username = formData.get('username');
			const password = formData.get('password');

			if (!username || !password) {
				return fail(400, { error: 'Username and password are required.' });
			}

			// login 함수 호출
			const result = await login(username, password);

			if (!result.success) {
				console.log(result.error);
				return fail(401, { error: result.error });
			}

			// JWT 쿠키 설정
			cookies.set('jwt', result.token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
			});

			console.log('JWT Token:', result.token);

		} catch (error) {
			console.error('Login action error:', error);
			return fail(500, { error: 'An unexpected error occurred. Please try again.' });
		}

		redirect(303, url.searchParams.get('redirectTo') ?? '/factories');
	},
};

export const load: PageServerLoad = async ({ cookies, url }) => {
	let userId = '';
	try {
		// JWT 가져오기
		const token = cookies.get('jwt');


		const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
		console.log(`Decoded userId from JWT: ${decoded.userId}`);
		userId = decoded.userId;

	} catch (error) {
		console.error(`JWT validation error at /: ${error}`);
	}

	// JWT 검증
	const isValidUser = await validateUserId(userId);
	if (isValidUser) {
		//console.log(isValidUser);
		redirect(303, url.searchParams.get('redirectTo') ?? '/factories');
	}
};